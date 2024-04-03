import { NextResponse } from "next/server";
import { put } from '@vercel/blob';
import { v4 } from "uuid";
 
export const runtime = 'edge';

function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {type:mime});
}
 
export async function POST(request) {

  console.log('request', request);
  const form = await request.formData();
  const file = form.get('image');
  console.log()
  const blob = await put(v4() + '.png', dataURLtoFile(file), { access: 'public' });
 
  return NextResponse.json(blob);
}
