import { NextResponse } from 'next/server';

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

    // 1. Clean and validate URL formatting parameters
    let targetUrlString = sourceVideoUrl.trim();
    if (!targetUrlString.includes('youtube.com') && !targetUrlString.includes('youtu.be')) {
      return NextResponse.json(
        { error: 'Invalid origin channel format. Provide a valid YouTube watch path.' },
        { status: 400 }
      );
    }

    // 2. Query the public oEmbed data block layer
    const oEmbedTarget = `https://www.youtube.com/oembed?url=${encodeURIComponent(targetUrlString)}&format=json`;
    const liveResponse = await fetch(oEmbedTarget);
    
    if (!liveResponse.ok) {
      throw new Error('Failed to resolve media stream matrix from public endpoint.');
    }

    const mediaData = await liveResponse.json();

    // 3. Construct unique operational token tracks
    const tokenID = `sync-${Math.random().toString(36).substring(4, 9)}`;

    // 4. Return the live asset layout to your Success state
    return NextResponse.json({
      id: tokenID,
      title: mediaData.title || "Unknown Stream Title",
      artist: mediaData.author_name || "SonicSync Transcoder Subsystem",
      album: 'Automated Live Vaults',
      duration: '3:45', // Standard mock fallback for duration since oEmbed excludes runtime metrics
      coverUrl: mediaData.thumbnail_url || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=300&q=80',
      fileSize: '8.9 MB',
      downloadUrl: '#',
      timestamp: new Date().toISOString().split('T')[0],
      targetUrl: targetUrlString
    });

  } catch (err) {
    console.error("Live Fetch Error Trace: ", err);
    return NextResponse.json(
      { error: 'An exception trace occurred inside live upstream data resolution loops.' }, 
      { status: 500 }
    );
  }
}