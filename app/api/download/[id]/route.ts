import { NextResponse } from 'next/server';
import { createReadStream, existsSync } from 'fs';
import { stat } from 'fs/promises';
import path from 'path';
import { Readable } from 'stream';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id || !/^sync-[a-z0-9]+$/.test(id)) {
    return NextResponse.json({ error: 'Invalid file ID.' }, { status: 400 });
  }

  const filePath = path.join('/tmp', `${id}.mp3`);

  if (!existsSync(filePath)) {
    return NextResponse.json(
      { error: 'File not found. It may have expired — please convert again.' },
      { status: 404 }
    );
  }

  // Pull the desired filename from query param set by the client
  const url = new URL(request.url);
  const rawName = url.searchParams.get('filename') || id;
  // Sanitize for Content-Disposition header (strip quotes and backslashes)
  const safeHeaderName = rawName.replace(/["\\\r\n]/g, '').substring(0, 200);

  const fileStats = await stat(filePath);
  const fileStream = createReadStream(filePath);
  const webStream = Readable.toWeb(fileStream) as ReadableStream;

  return new NextResponse(webStream, {
    status: 200,
    headers: {
      'Content-Type': 'audio/mpeg',
      'Content-Length': String(fileStats.size),
      'Content-Disposition': `attachment; filename="${safeHeaderName}.mp3"`,
      'Cache-Control': 'no-store',
    },
  });
}
