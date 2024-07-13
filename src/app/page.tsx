// //src/app/page.tsx

import Link from 'next/link';
import Image from 'next/image';
 

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 text-white">
      <div className="w-full max-w-4xl px-4 py-16 text-center">
        <Image src="/radcom.png" alt="Radcom Logo" width={150} height={150} className="mx-auto mb-8" />
        <h1 className="text-6xl font-extrabold mb-4 animate-fade-in-down">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500">Radcom</span>
        </h1>
        <p className="text-xl mb-12 animate-fade-in-up">Empowering your digital journey with cutting-edge solutions</p>
        <div className="flex justify-center space-x-6">
          <Link href="/login" className="bg-white text-purple-600 font-bold py-3 px-8 rounded-full hover:bg-opacity-80 transition duration-300 transform hover:scale-105 shadow-lg">
            Login
          </Link>
          <Link href="/register" className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-purple-600 transition duration-300 transform hover:scale-105 shadow-lg">
            Register
          </Link>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-24">
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" fill="currentColor" fillOpacity="0.2"></path>
        </svg>
      </div>
    </div>
  );
}

 