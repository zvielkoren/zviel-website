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
                  <Link href="/projects">
                    <Button color="primary" variant="solid" size="lg" className="font-bold hover:bg-[#45505b] transition-colors duration-300 px-6 py-3 rounded-full shadow-lg">
                      👨‍💻 View Projects
                    </Button>
                  </Link>
                  {/* <Link href="/contact"><Button color="secondary" as="a" variant="solid" size="lg" className="font-bold hover:bg-[#45505b] transition-colors duration-300">Contact Me</Button></Link> */}        </div>
      </section>

      <section id="skills" className="w-full max-w-4xl my-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
            <h3 className="text-2xl font-semibold mb-6 text-center text-white-400">Top Skills</h3>
            <ul className="flex flex-wrap justify-center gap-4">
              <li className="bg-gray-600 rounded-full px-5 py-2 text-lg font-medium shadow-lg transition-all hover:bg-gray-500 hover:scale-105">TypeScript</li>
              <li className="bg-gray-600 rounded-full px-5 py-2 text-lg font-medium shadow-lg transition-all hover:bg-gray-500 hover:scale-105">Java</li>
              <li className="bg-gray-600 rounded-full px-5 py-2 text-lg font-medium shadow-lg transition-all hover:bg-gray-500 hover:scale-105">Python</li>
              <li className="bg-gray-600 rounded-full px-5 py-2 text-lg font-medium shadow-lg transition-all hover:bg-gray-500 hover:scale-105">SQL</li>
            </ul>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
            <h3 className="text-2xl font-semibold mb-6 text-center text-white-400">Other Skills</h3>
            <ul className="flex flex-wrap justify-center gap-4">
              <li className="bg-gray-600 rounded-full px-5 py-2 text-lg font-medium shadow-lg transition-all hover:bg-gray-500 hover:scale-105">JavaScript</li>
              <li className="bg-gray-600 rounded-full px-5 py-2 text-lg font-medium shadow-lg transition-all hover:bg-gray-500 hover:scale-105">Next.js</li>
              <li className="bg-gray-600 rounded-full px-5 py-2 text-lg font-medium shadow-lg transition-all hover:bg-gray-500 hover:scale-105">C#</li>
              <li className="bg-gray-600 rounded-full px-5 py-2 text-lg font-medium shadow-lg transition-all hover:bg-gray-500 hover:scale-105">Node.js</li>
              <li className="bg-gray-600 rounded-full px-5 py-2 text-lg font-medium shadow-lg transition-all hover:bg-gray-500 hover:scale-105">Kotlin</li>
              <li className="bg-gray-600 rounded-full px-5 py-2 text-lg font-medium shadow-lg transition-all hover:bg-gray-500 hover:scale-105">etc</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="contact" className="w-full max-w-4xl text-center">
        <h2 className="text-2xl font-bold mb-4"></h2>
        <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
        <p className="mb-4">I'm always open to new opportunities and collaborations.</p>

        <Button color="primary" variant="solid" size="lg" className="font-bold hover:bg-[#45505b] transition-colors duration-300 px-6 py-3 rounded-full shadow-lg" as="a" href="/contact"> ✉️ Email Me</Button>
      </section>
      <footer className="mt-16 text-center">
        <p>© 2021 - {new Date().getFullYear()} Zviel Koren. All rights reserved.</p>
      </footer>
    </main>
  );
}