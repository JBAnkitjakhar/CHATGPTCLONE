//  //src/components/TransitionScreen.tsx

import React from "react";
import Image from "next/image";
import { useUser } from "@/contexts/UserContext";

const TransitionScreen: React.FC = () => {
  const { username } = useUser();

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500 z-50">
      <div className="relative w-48 h-48 mb-8 perspective-500">
        <div className="w-full h-full animate-3d-rotate">
          <Image
            src="/radcom.png"
            alt="Radcom Logo"
            layout="fill"
            objectFit="contain"
          />
        </div>
      </div>
      <h2 className="text-3xl font-bold text-white mb-2 animate-fade-in-up">
        {/* Hey, hello there! */}
      </h2>
      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400 mb-8 animate-fade-in-up animation-delay-100">
        {/* Welcome {username || "..."} */}
      </h1>
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
    </div>
  );
};

export default TransitionScreen;
