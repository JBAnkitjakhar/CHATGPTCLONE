 
//src/app/(auth)/register/page.tsx

'use client';
import { useLoading } from '@/contexts/LoadingContext';
import { useUser } from '@/contexts/UserContext';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Register() {
  const { setIsLoading } = useLoading();
  const { setUsername: setGlobalUsername } = useUser();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        setGlobalUsername(username);
        router.push('/login');
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (error) {
      setError('An unexpected error occurred');
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row w-full max-w-4xl overflow-hidden">
        <div className="absolute inset-0 rounded-3xl border-4 border-transparent animate-border-flow"></div>
        
        <div className="w-full md:w-1/2 p-8 flex flex-col items-center justify-center relative z-10 bg-gradient-to-br from-purple-500 to-blue-500">
          <div className="animate-float mb-8" style={{ animationDuration: '3s' }}>
            <Image src="/radcom.png" alt="Radcom Logo" width={150} height={150} className="drop-shadow-xl" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 animate-fade-in-down">Join Radcom</h2>
          <p className="text-gray-200 mb-8 text-center animate-fade-in-up">Create an account to get started</p>
        </div>

        <div className="w-full md:w-1/2 p-8 bg-gradient-to-br from-purple-50 to-blue-50 rounded-r-3xl relative z-10 overflow-hidden">
          
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute w-full h-full bg-gradient-to-br from-purple-100 to-blue-100 animate-gradient"></div>
            <div className="absolute top-0 left-0 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-float-slow"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-float-slow animation-delay-2000"></div>
          </div>

          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-purple-600 mb-6 animate-fade-in-down">Register your account</h2>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 animate-fade-in-down" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative group">
                <input 
                  type="text" 
                  className="peer w-full p-2 border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-purple-600 placeholder-transparent transition-all duration-300 bg-transparent group-hover:border-purple-400"
                  placeholder="UserName"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <label className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-800 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-purple-600 peer-focus:text-sm group-hover:-top-3.5 group-hover:text-purple-400 group-hover:text-sm">
                  Username :
                </label>
              </div>

              <div className="relative group">
                <input 
                  type="email" 
                  className="peer w-full p-2 border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-purple-600 placeholder-transparent transition-all duration-300 bg-transparent group-hover:border-purple-400"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-700 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-purple-600 peer-focus:text-sm group-hover:-top-3.5 group-hover:text-purple-400 group-hover:text-sm">
                  Email :
                </label>
              </div>

              <div className="relative group">
                <input 
                  type="password" 
                  className="peer w-full p-2 border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-purple-600 placeholder-transparent transition-all duration-300 bg-transparent group-hover:border-purple-400"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-purple-600 peer-focus:text-sm group-hover:-top-3.5 group-hover:text-purple-400 group-hover:text-sm">
                  Password :
                </label>
              </div>

              <div className="flex items-center">
                <input type="checkbox" className="form-checkbox text-purple-600" id="terms" required />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-600">I agree to the Terms and Conditions</label>
              </div>

              <button type="submit" className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
                Create Account
              </button>
            </form>

            <p className="mt-8 text-sm text-center">
              Already have an account? <Link href="/login" className="text-purple-600 font-semibold hover:underline">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}