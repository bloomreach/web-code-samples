import {NextRequest, NextResponse} from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const {searchParams} = new URL(req.url);
    const url = searchParams.get('url');

    if (!url) {
      return new NextResponse(JSON.stringify({message: 'url query parameter is required'}), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const response = await fetch(url);
    if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);
    if (response.headers.get('content-length') === '0') throw new Error('no content-length');

    const imageBlob = await response.blob();
    const buff = await imageBlob.arrayBuffer();
    const arr = new Uint8Array(buff);


    return new NextResponse(arr, {
      status: 200,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'image/*',
        'Content-Length': response.headers.get('content-length') || String(arr.length),
      },
    })
  } catch (e: any) {
    console.error(e);
    return new NextResponse(JSON.stringify({ message: e.message || 'An error occurred' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
