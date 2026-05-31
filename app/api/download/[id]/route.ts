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

  // Safely parse filename from query string — works even with relative URLs
  let filenameParam = id;
  try {
    // request.url may be relative in some Next.js environments, so use a dummy base
    const parsed = new URL(request.url, 'http://localhost');
    const raw = parsed.searchParams.get('filename');
    if (raw && raw.trim().length > 0) {
      filenameParam = raw.trim();
    }
  } catch {
    // Fall back to id
  }

  // Strip characters illegal in Content-Disposition filenames
  const safeHeaderName = filenameParam
    .replace(/["\\\r\n]/g, '')   // strip quotes, backslashes, newlines
    .replace(/[^\x20-\x7E]/g, '') // strip non-ASCII (emojis, Hindi chars, etc)
    .replace(/\s+/g, '_')         // spaces to underscores
    .substring(0, 200)
    || id; // final fallback if everything gets stripped

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
