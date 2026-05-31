import { NextResponse } from 'next/server';
import { createReadStream, existsSync } from 'fs';
import { stat } from 'fs/promises';
import path from 'path';
import { Readable } from 'stream';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // Basic validation — only allow alphanumeric + dash (the format we generate)
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

  const fileStats = await stat(filePath);
  const fileStream = createReadStream(filePath);

  // Convert Node.js Readable to Web ReadableStream for Next.js Response
  const webStream = Readable.toWeb(fileStream) as ReadableStream;

  return new NextResponse(webStream, {
    status: 200,
    headers: {
      'Content-Type': 'audio/mpeg',
      'Content-Length': String(fileStats.size),
      'Content-Disposition': `attachment; filename="${id}.mp3"`,
      'Cache-Control': 'no-store',
    },
  });
}
