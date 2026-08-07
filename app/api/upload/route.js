import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'missing image file' }, { status: 400 });
    }

    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY || '';
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || '';
    const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT || '';

    if (!publicKey || !privateKey || !urlEndpoint) {
      return NextResponse.json({ error: 'ImageKit credentials missing' }, { status: 500 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const bytes = Buffer.from(arrayBuffer);
    const originalName = file.name || 'image.jpg';

    const token = crypto.randomUUID();
    const expire = Math.floor(Date.now() / 1000) + 3600;
    const signature = crypto
      .createHmac('sha1', privateKey)
      .update(token + expire)
      .digest('hex');

    const imagekitUploadUrl = `${urlEndpoint.replace(/\/$/, '')}/upload`;
    const payload = new FormData();
    payload.append('file', new Blob([bytes]), originalName);
    payload.append('fileName', originalName);
    payload.append('publicKey', publicKey);
    payload.append('signature', signature);
    payload.append('token', token);
    payload.append('expire', String(expire));
    payload.append('useUniqueFileName', 'true');

    const uploadResponse = await fetch(imagekitUploadUrl, {
      method: 'POST',
      body: payload,
    });

    const uploadJson = await uploadResponse.json();
    if (!uploadResponse.ok || !uploadJson?.url) {
      return NextResponse.json({ error: uploadJson?.message || 'image upload failed' }, { status: 500 });
    }

    return NextResponse.json({ url: uploadJson.url });
  } catch (error) {
    return NextResponse.json({ error: 'image upload failed', details: String(error) }, { status: 500 });
  }
}
