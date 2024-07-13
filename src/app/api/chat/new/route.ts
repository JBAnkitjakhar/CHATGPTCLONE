//src/app/api/chat/new/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import User from "@/models/User";
import connectDB from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const newChat = { title: "New Chat", messages: [] };
    user.chats.unshift(newChat);
    await user.save();

    return NextResponse.json({
      message: "New chat created successfully",
      newChat: {
        _id: user.chats[0]._id,
        title: user.chats[0].title,
      },
    });
  } catch (error) {
    console.error("Error creating new chat:", error);
    return NextResponse.json(
      { message: "Error creating new chat" },
      { status: 500 }
    );
  }
}
