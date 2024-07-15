//src/app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import User from "@/models/User";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";
import { ChatInfo, Message } from "@/types/chat";
// Define interfaces
interface Chat {
  _id: mongoose.Types.ObjectId;
  title: string;
  createdAt: Date;
  messages: any[]; // You might want to define a more specific type for messages
}

interface UserDocument extends mongoose.Document {
  email: string;
  chats: Chat[];
}

export async function GET(request: NextRequest) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = (await User.findOne({
      email: session.user.email,
    })) as UserDocument | null;

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (!user.chats || !Array.isArray(user.chats)) {
      console.error("User chats are not defined or not an array.");
      return NextResponse.json(
        { message: "Error fetching chat history" },
        { status: 500 }
      );
    }

    const chats: ChatInfo[] = user.chats.map((chat: any) => ({
      _id: chat._id,
      title: chat.title,
      createdAt: chat.createdAt,
      messages: chat.messages.map(
        (msg: any): Message => ({
          _id: msg._id,
          role: msg.role,
          content: msg.content,
          createdAt: msg.createdAt,
        })
      ),
    }));

    return NextResponse.json({ chats });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return NextResponse.json(
      { message: "Error fetching chat history" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = (await User.findOne({
      email: session.user.email,
    })) as UserDocument | null;

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const newChat: Chat = {
      _id: new mongoose.Types.ObjectId(),
      title: "New Chat",
      createdAt: new Date(),
      messages: [],
    };
    user.chats.unshift(newChat);

    await user.save();

    return NextResponse.json({ newChat });
  } catch (error) {
    console.error("Error creating new chat:", error);
    return NextResponse.json(
      { message: "Error creating new chat" },
      { status: 500 }
    );
  }
}
