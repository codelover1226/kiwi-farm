import { createClient, groq } from 'next-sanity';

const config = {
  projectId: '5srusl5s',
  dataset: 'production',
  apiVersion: '2023-10-25',
  cache: 'no-cache',
  next: { revalidate: 1 },
  useCdn: false,
};

export async function getProducts(type) {
  const client = createClient(config);

  return client.fetch(
    groq`*[_type == '${type}'] | order(order) {
      _id,
      _createdAt,
      title,
      description,
      order,
      'slug': slug.current,
      'images': images[].asset->url,
      content
      }`,
  );
}

export async function getUser(slug) {
  const client = createClient(config);

  return client.fetch(
    groq`*[_type == 'users' && slug.current == $slug] {
      _id,
      _createdAt,
      title,
      description,
      'slug': slug.current,
      content
      }`,
    { slug },
  );
}
export async function getUsers() {
  const client = createClient(config);

  return client.fetch(
    groq`*[_type == 'users'] {
      _id,
      _createdAt,
      title,
      description,
      'slug': slug.current,
      content
      }`
  );
}
export async function getAll() {
  const client = createClient(config);

  return client.fetch(
    groq`*[true] {
      _id,
      _createdAt,
      _type,
      title,
      description,
      'slug': slug.current,
      content
      }`
  );
}
