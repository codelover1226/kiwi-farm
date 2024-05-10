import { ProductCardB } from '@/components/ProductCardB';
export default function Home() {
  return (
    <main className='flex min-h-[calc(100vh-175px)] flex-col items-center py-10'>
      <h1 className='text-2xl pb-6'>Edibles</h1>

      <ProductCardB product={'edible'} />
    </main>
  );
}
