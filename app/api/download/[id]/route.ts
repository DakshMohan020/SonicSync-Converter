import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { createReadStream, existsSync } from 'fs';
import { stat } from 'fs/promises';
import path from 'path';
import { Readable } from 'stream';

export async function GET(
  request: NextRequest,
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

  // NextRequest.nextUrl.searchParams is the reliable way to read query params in Next.js 14
  const rawFilename = request.nextUrl.searchParams.get('filename');

  // ASCII-safe fallback filename (for the legacy filename= field)
  const asciiFallback = (rawFilename || id)
    .replace(/[^\x20-\x7E]/g, '')   // strip non-ASCII
    .replace(/[^a-zA-Z0-9 .\-_]/g, '_') // replace special chars
    .replace(/\s+/g, '_')
    .substring(0, 150)
    || id;

  // RFC 5987 encoded filename — supports Unicode (Hindi, emoji, etc.) in modern browsers
  const rfc5987Filename = rawFilename
    ? encodeURIComponent(rawFilename + '.mp3')
    : `${id}.mp3`;

  const fileStats = await stat(filePath);
  const fileStream = createReadStream(filePath);
  const webStream = Readable.toWeb(fileStream) as ReadableStream;

  return new NextResponse(webStream, {
    status: 200,
    headers: {
      'Content-Type': 'audio/mpeg',
      'Content-Length': String(fileStats.size),
      // Use both: filename= for old browsers, filename*= (RFC 5987) for modern ones
      'Content-Disposition': `attachment; filename="${asciiFallback}.mp3"; filename*=UTF-8''${rfc5987Filename}`,
      'Cache-Control': 'no-store',
    },
  });
}
