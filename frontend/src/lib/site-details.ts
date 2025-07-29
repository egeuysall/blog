import { name, image, description } from '@/app/layout';

export async function getProduct() {
  return {
    name: name,
    image: image,
    description: description,
  };
}
