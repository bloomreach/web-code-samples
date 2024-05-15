import {NextRequest, NextResponse} from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const {searchParams} = new URL(req.url);
    const url = searchParams.get('url')

    if (!url) {
      return res.status(400).json({message: 'url query parameter is required'});
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
        'Content-Length': response.headers.get('content-length') || arr.length,
      },
    })
  } catch (e) {
    console.error(e);
    return new NextResponse.error(e);
  }
}
