import { list } from '@vercel/blob';
import Image from 'next/image';
 
export async function Images() {
  async function allImages() {
    const blobs = await list();
    console.log('blobs', blobs);
    return blobs;
  }
  const images = await allImages();

  console.log('images', images);
 
  return (
    <section>
      {images.blobs.map((image) => (
        <img
          key={image.pathname}
          src={image.url}
          alt="Image"
          width={400}
          height={400}
          />
      ))}
    </section>
  );
}