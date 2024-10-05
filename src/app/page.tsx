import Image from "next/image";
import { Button } from "@nextui-org/react";
import Link from "next/link";


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24" style={{ backgroundColor: '#17212b', color: 'white' }}>
      <header className="w-full text-center">
        <h1 className="text-4xl font-bold mb-4">Zviel Koren</h1>
        <p className="text-xl">Full Stack Developer</p>
      </header>

      <section className="flex flex-col items-center">
        {/* <Image
          src="/profile-picture.png"
          alt="Zviel Koren"
          width={200}
          height={200}
          className="rounded-full mb-8"
          draggable="false"
  
        /> */}
        <p className="text-center max-w-2xl mb-8">
          Hi, I'm Zviel Koren, a passionate full stack developer with expertise in modern web technologies.
          I love creating efficient, scalable, and user-friendly applications.
        </p>
        <div className="flex space-x-4">
          <Link href="/projects"><Button color="primary" as="a">View Projects</Button></Link>
          {/* <Link href="/contact"><Button color="secondary" as="a">Contact Me</Button></Link> */}
        </div>
      </section>

      <section id="skills" className="w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-4">Skills</h2>
        <ul className="flex flex-wrap justify-center gap-4">
          <li className="bg-gray-700 rounded-full px-4 py-2">JavaScript</li>
          <li className="bg-gray-700 rounded-full px-4 py-2">React</li>
          <li className="bg-gray-700 rounded-full px-4 py-2">Node.js</li>
          <li className="bg-gray-700 rounded-full px-4 py-2">Python</li>
          <li className="bg-gray-700 rounded-full px-4 py-2">SQL</li>
          <li className="bg-gray-700 rounded-full px-4 py-2">TypeScript</li>
          <li className="bg-gray-700 rounded-full px-4 py-2">Next.js</li>
          <li className="bg-gray-700 rounded-full px-4 py-2">C#</li>
          <li className="bg-gray-700 rounded-full px-4 py-2">Java</li>
          <li className="bg-gray-700 rounded-full px-4 py-2">Kotlin</li>
          <li className="bg-gray-700 rounded-full px-4 py-2">etc</li>
        </ul>
      </section>

      <section id="contact" className="w-full max-w-4xl text-center">
        <h2 className="text-2xl font-bold mb-4"></h2>
        <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
        <p className="mb-4">I'm always open to new opportunities and collaborations.</p>
        <Button color="primary" as="a" href="/contact">Email Me</Button>
      </section>

      <footer className="mt-16 text-center">
        <p>© 2021 - {new Date().getFullYear()} Zviel Koren. All rights reserved.</p>
      </footer>
    </main>
  );
}