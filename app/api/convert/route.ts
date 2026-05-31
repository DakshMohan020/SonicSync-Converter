import { NextResponse } from 'next/server';
import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execFileAsync = promisify(execFile);

export async function POST(request: Request) {
  try {
    const dataBody = await request.json();
    const sourceVideoUrl = dataBody.url;

    if (!sourceVideoUrl) {
      return NextResponse.json(
        { error: 'Structural track destination parameter missing.' },
        { status: 400 }
      );
    }

    let targetUrlString = sourceVideoUrl.trim();
    if (!targetUrlString.includes('youtube.com') && !targetUrlString.includes('youtu.be')) {
      return NextResponse.json(
        { error: 'Invalid origin channel format. Provide a valid YouTube watch path.' },
        { status: 400 }
      );
    }

    // 1. Fetch metadata via oEmbed (fast, no download)
    const oEmbedTarget = `https://www.youtube.com/oembed?url=${encodeURIComponent(targetUrlString)}&format=json`;
    const oEmbedResponse = await fetch(oEmbedTarget);
    if (!oEmbedResponse.ok) {
      throw new Error('Failed to resolve video metadata. Check the URL and try again.');
    }
    const mediaData = await oEmbedResponse.json();

    // 2. Generate a unique token ID for this job
    const tokenID = `sync-${Math.random().toString(36).substring(2, 8)}`;
    const outputPath = path.join('/tmp', `${tokenID}.mp3`);

    // 3. Run yt-dlp to download and convert to MP3
    // --no-check-certificate: handles environments with self-signed certs
    // -x: extract audio only
    // --audio-format mp3: convert to mp3
    // --audio-quality 0: best quality (320kbps VBR)
    // --no-playlist: only download the single video, not the whole playlist if URL has one
    // -o: output file path
    await execFileAsync('yt-dlp', [
      '--no-check-certificate',
      '-x',
      '--audio-format', 'mp3',
      '--audio-quality', '0',
      '--no-playlist',
      '--no-warnings',
      '-o', outputPath,
      targetUrlString,
    ]);

    // 4. Get actual file size after download
    const { stat } = await import('fs/promises');
    const fileStats = await stat(outputPath);
    const fileSizeMB = (fileStats.size / (1024 * 1024)).toFixed(1);

    return NextResponse.json({
      id: tokenID,
      title: mediaData.title || 'Unknown Stream Title',
      artist: mediaData.author_name || 'Unknown Artist',
      album: 'Automated Live Vaults',
      duration: '—',  // oEmbed doesn't provide duration; could add yt-dlp --print %(duration_string)s in a separate call
      coverUrl: mediaData.thumbnail_url || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=300&q=80',
      fileSize: `${fileSizeMB} MB`,
      downloadUrl: `/api/download/${tokenID}`,
      timestamp: new Date().toISOString().split('T')[0],
      targetUrl: targetUrlString,
    });

  } catch (err) {
    console.error('Conversion Error:', err);
    const message = err instanceof Error ? err.message : 'Unknown error occurred.';
    return NextResponse.json(
      { error: `Conversion failed: ${message}` },
      { status: 500 }
    );
  }
}
