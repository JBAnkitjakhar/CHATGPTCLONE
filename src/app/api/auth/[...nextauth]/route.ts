// //src/app/api/auth/[...nextauth]/route.ts
// import { AuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
// import User from "@/models/User";
// import bcrypt from "bcryptjs";
// import { MongoClient } from "mongodb";
// import mongoose from "mongoose";

// const MONGODB_URI = process.env.MONGODB_URI;

// if (!MONGODB_URI) {
//   throw new Error(
//     "Please define the MONGODB_URI environment variable inside .env.local"
//   );
// }

// declare global {
//   var _mongoClientPromise: Promise<MongoClient> | undefined;
// }

// let clientPromise: Promise<MongoClient>;

// if (process.env.NODE_ENV === "development") {
//   if (!global._mongoClientPromise) {
//     const client = new MongoClient(MONGODB_URI);
//     global._mongoClientPromise = client.connect();
//   }
//   clientPromise = global._mongoClientPromise;
// } else {
//   const client = new MongoClient(MONGODB_URI);
//   clientPromise = client.connect();
// }

// export const authOptions: AuthOptions = {
//   adapter: MongoDBAdapter(clientPromise),
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           throw new Error("Please enter an email and password");
//         }

//         await mongoose.connect(MONGODB_URI);
//         const user = await User.findOne({ email: credentials.email });

//         if (!user || !user.password) {
//           throw new Error("No user found with this email");
//         }

//         const isPasswordMatch = await bcrypt.compare(
//           credentials.password,
//           user.password
//         );

//         if (!isPasswordMatch) {
//           throw new Error("Incorrect password");
//         }

//         return {
//           id: user._id.toString(),
//           email: user.email,
//           name: user.username,
//         };
//       },
//     }),
//   ],
//   session: {
//     strategy: "jwt",
//   },
//   pages: {
//     signIn: "/login",
//   },
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.username = user.name;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (token && session.user) {
//         session.user.id = token.id as string;
//         session.user.username = token.username as string;
//       }
//       return session;
//     },
//   },
// };
import NextAuth from "next-auth";
import { authOptions } from "./authOptions";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
