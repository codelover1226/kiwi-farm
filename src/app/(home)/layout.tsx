
'use client'
import dynamic from 'next/dynamic';

// Dynamically import the HomeLayout component with SSR disabled
const HomeLayout = dynamic(() => import('./homeLayout'), { ssr: false });

export default function App({ children }: {children: React.ReactNode}) {
  console.log("Home app Layout");
 return (    
    <div>
      <HomeLayout>
        {children}
      </HomeLayout>
    </div>
 );
}
