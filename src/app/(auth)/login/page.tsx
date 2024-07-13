  //src/app/(auth)/login/page.tsx

"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLoading } from "@/contexts/LoadingContext";
import { useUser } from "@/contexts/UserContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { setIsLoading } = useLoading();
  const { setUsername } = useUser();

  useEffect(() => {
    setIsLoading(false);
  }, [setIsLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
      } else {
        // The username is now included in the session
        const session = await getSession();
        if (session?.user?.username) {
          setUsername(session.user.username);
        }
        router.push("/dashboard");
      }
    } catch (error) {
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row w-full max-w-4xl overflow-hidden">
        <div className="absolute inset-0 rounded-3xl border-4 border-transparent animate-border-flow"></div>

        <div className="w-full md:w-1/2 p-8 flex flex-col items-center justify-center relative z-10 bg-gradient-to-br from-purple-500 to-blue-500">
          <div
            className="animate-float mb-8"
            style={{ animationDuration: "3s" }}
          >
            <Image
              src="/radcom.png"
              alt="Radcom Logo"
              width={150}
              height={150}
              className="drop-shadow-xl"
            />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 animate-fade-in-down">
            Welcome Again!
          </h2>
          <p className="text-gray-200 mb-8 text-center animate-fade-in-up">
            We&#39;re glad to see you back
          </p>
        </div>

        <div className="w-full md:w-1/2 p-8 bg-gradient-to-br from-purple-50 to-blue-50 rounded-r-3xl relative z-10 overflow-hidden">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute w-full h-full bg-gradient-to-br from-purple-100 to-blue-100 animate-gradient"></div>
            <div className="absolute top-0 left-0 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-float-slow"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-float-slow animation-delay-2000"></div>
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500 mb-6 animate-fade-in-down">
              Access Your Account
            </h2>

            {error && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 animate-fade-in-down"
                role="alert"
              >
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
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
                  Email
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
                <label className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-600 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-purple-600 peer-focus:text-sm group-hover:-top-3.5 group-hover:text-purple-400 group-hover:text-sm">
                  Password
                </label>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox text-purple-600"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Remember me
                  </span>
                </label>
                <a
                  href="/forgotpassword"
                  className="text-sm text-purple-600 hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 rounded-md text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
              >
                Sign In
              </button>
            </form>

            <p className="mt-8 text-sm text-center">
              Don&#39;t have an account?{" "}
              <Link
                href="/register"
                className="text-purple-600 font-semibold hover:underline"
              >
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
