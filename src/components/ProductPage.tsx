import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';

export default function ProductPage() {
  const categories = [
    {
      title: 'flower',
      image: '/flower.jpg',
    },
    {
      title: 'edibles',
      image: '/kiwi_farms_edibles.jpg',
    },
    {
      title: 'extracts',
      image: '/kiwi_farms_extracts.jpg',
    },
    {
      title: 'pre-rolls',
      image: '/kiwi_canna_prerolls.jpg',
    },
  ];

  const categoriesRender = [];
  categories.forEach((category, i) => {
    categoriesRender.push(
      <Link href={category.title}>
        <Card
          className='max-w-sm h-[28rem] rounded overflow-hidden shadow-lg p-2 hover:bg-accent'
          key={i}>
          <CardHeader>
            <Image
              className='w-full bg-white aspect-square rounded object-cover'
              src={category.image}
              alt='category'
              width={300}
              height={300}
            />
            <CardTitle className='text-2xl font-normal text-center capitalize'>
              {category.title}
            </CardTitle>
          </CardHeader>
        </Card>
      </Link>,
    );
  });

  return (
    <div className='flex min-h-screen flex-col items-center justify-between py-10'>
      <div className='p-10'>
        <Image
          src='/kiwi_logo.jpg'
          alt='Kiwi Farms - Premium Cannabis'
          width={350}
          height={350}
          className='rounded'
        />
      </div>

      <h1 className='text-2xl pb-6'>Nothing For Sale</h1>

      <h2 className='text-lg pb-8'>Educational Purposes Only</h2>

      <h2 className='text-lg pb-10'>(Click Image For More Details)</h2>

      <div className='flex flex-row flex-wrap gap-6 justify-center m-2'>
        {categoriesRender}
      </div>
    </div>
  );
}
