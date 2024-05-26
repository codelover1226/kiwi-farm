'use client'
import dynamic from 'next/dynamic';

const BackEndLayout = dynamic(() => import('./backEndLayout'), { ssr: false });

export default function App({ children }: {children: React.ReactNode}) {
  console.log("BackEnd App layout")
  return (    
    <div>
      <BackEndLayout>
        {children}
      </BackEndLayout>
    </div>
  );
}