import { NewMemberForm } from '@/components/NewMemberForm';
import Image from 'next/image';
export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center gap-10 py-10'>
      <Image
        src='/kiwi_logo.jpg'
        alt='Image description'
        width={260}
        height={260}
      />

      <NewMemberForm />
    </main>
  );
}
