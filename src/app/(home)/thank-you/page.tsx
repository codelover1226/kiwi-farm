import Image from "next/image";
export default function Home() {
  return (
    <main className="flex justify-center h-screen px-6">
      <div
        className="flex 
        rounded-sm py-16 items-center max-w-[500px] flex-col mt-2 px-6 mb-24"
      >
        <Image
          src="/kiwi_logo.jpg"
          alt="Image description"
          width={240}
          height={240}
        />

        <h1 className="text-3xl text-center mt-8 text-[#017c6b] mb-10">
          Thank you for registering!
        </h1>
        <h1 className="text-xl text-center text-[black] mb-10">
          Please allow 1-2 hours for a friend request from Kiwi Farms at social
          media provided.
        </h1>
        <br />

        <br />
      </div>
    </main>
  );
}
