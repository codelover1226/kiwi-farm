'use server'
import Link from 'next/link';
import { getUser } from '../../../../../sanity/sanity.utils';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import { cookies } from 'next/headers';
import PasswordPromptDialog from '@/components/PasswordPromptDialog';

type Props = {
  params: { user: string };
};

export default async function UserPage({ params }: Props) {
  const slug = params.user;
  const user = await getUser(slug);

  const cookiesStore = cookies();
  const loginCookies = cookiesStore.get(slug);

  const isLoggedIn = !!loginCookies?.value;

  return (
    <main className='flex justify-center xs:px-4 md:px-6 min-h-screen'>
      {isLoggedIn ? (
        <div
          className='mt-16 flex xs:px-5 md:px-10 mx-10 xs:min-w-full md:min-w-[400px] max-w-[600px] 
      justify-left text-left rounded-sm py-16 flex-col border-2 mb-24 border-gray-500'>
          <h1 className='text-2xl underline  text-[#017c6b] mb-10'>
            <strong>
              {user[0].title.replace(/\b\w/g, c => c.toUpperCase())} List
            </strong>
          </h1>

          <br />

          <PortableText value={user[0].content} />
          <br />
        </div>
      ) : (
        <div className='pt-20'>
          <h1>Sorry, you are not authorized to view this page.</h1>
          <h2>
            Please{' '}
            <Link href={'/login'} className='underline'>
              Login
            </Link>
            .
          </h2>
        </div>
      )}
    </main>
  );
}
