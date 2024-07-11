import Image from 'next/image';

import { ProductCard } from '@/components/ProductCard';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center py-10'>
      <h1 className='text-2xl pb-6'>Miscellaneous</h1>

      <h2 className="text-lg pb-8">Educational Purposes Only</h2>

      <h2 className="text-lg pb-10">(Click Image For More Details)</h2>

      <ProductCard product={'miscellaneous'} user_id={"12"} />
    </main>
  );
}
