import { NextResponse } from 'next/server';
import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execFileAsync = promisify(execFile);

// Format seconds into m:ss string
function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export async function POST(request: Request) {
  try {
    const dataBody = await request.json();
    const sourceVideoUrl = dataBody.url;

    if (!sourceVideoUrl) {
      return NextResponse.json(
        { error: 'Please provide a YouTube URL.' },
        { status: 400 }
      );
    }

    let targetUrlString = sourceVideoUrl.trim();
    if (!targetUrlString.includes('youtube.com') && !targetUrlString.includes('youtu.be')) {
      return NextResponse.json(
        { error: 'Please provide a valid YouTube URL.' },
        { status: 400 }
      );
    }

    // 1. Fetch rich metadata via yt-dlp --print (fast, no download)
    //    Gets: title, uploader, album, duration (seconds), thumbnail URL
    const { stdout: metaRaw } = await execFileAsync('yt-dlp', [
      '--no-check-certificate',
      '--no-playlist',
      '--print', '%(title)s|||%(uploader)s|||%(album)s|||%(duration)s|||%(thumbnail)s',
      targetUrlString,
    ]);

    const [ytTitle, ytUploader, ytAlbum, ytDuration, ytThumbnail] = metaRaw.trim().split('|||');

    const durationSecs = parseInt(ytDuration, 10);
    const durationFormatted = isNaN(durationSecs) ? '—' : formatDuration(durationSecs);
    const albumName = (!ytAlbum || ytAlbum === 'NA') ? 'Single' : ytAlbum;
    const thumbnail = (!ytThumbnail || ytThumbnail === 'NA')
      ? 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=300&q=80'
      : ytThumbnail;

    // 2. Generate unique ID and output path
    const tokenID = `sync-${Math.random().toString(36).substring(2, 8)}`;
    const outputPath = path.join('/tmp', `${tokenID}.mp3`);

    // 3. Download and convert to MP3 with yt-dlp + ffmpeg
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

    // 4. Get real file size from disk
    const { stat } = await import('fs/promises');
    const fileStats = await stat(outputPath);
    const fileSizeMB = (fileStats.size / (1024 * 1024)).toFixed(1);

    return NextResponse.json({
      id: tokenID,
      title: ytTitle || 'Unknown Title',
      artist: ytUploader || 'Unknown Artist',
      album: albumName,
      duration: durationFormatted,
      coverUrl: thumbnail,
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
