import Image from "next/image";

export default function About() {
  return (
    <main className="flex min-h-screen flex-col items-center mb-20 pt-10 pb-10 px-5 md:px-20">
      <Image
        className="ml-[-8px]"
        src="/kiwi_logo.jpg"
        alt="Image description"
        width={260}
        height={260}
      />
      <h1 className="text-2xl pb-10 pt-10">About Us</h1>
      <p>
        Kiwi Canna is founded on the principle of sourcing the finest cannabis.
        To achieve this goal, we select only the finest plants that produce
        highly aromatic, terpene-rich flowers using genetics from top quality
        grows.
      </p>
      <div className="p-10">
        <Image
          src="/grow_pic.jpg"
          alt="Indoor grow"
          width={800}
          height={500}
          className="rounded"
        />
      </div>
      <p>
        Cannabis sativa Linnaeus, or simply “cannabis,” has been cultivated by
        humans for over 4,800 years. One of the earliest mentions of its healing
        properties stem from the times of the Chinese Emperor Shen Nung, circa
        2800 BCE. And for thousands of years humans have enjoyed the epicurean
        delight both from smelling and tasting the flowers of this magical
        plant, and also from how the plant enriches other experiences.
      </p>
    </main>
  );
}
