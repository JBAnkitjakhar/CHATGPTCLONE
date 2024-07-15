//src/app/api/chat/[chatId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import User from "@/models/User";
import connectDB from "@/lib/mongodb";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function GET(
  request: NextRequest,
  { params }: { params: { chatId: string } }
) {
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

    const chat = user.chats.id(params.chatId);

    if (!chat) {
      return NextResponse.json({ message: "Chat not found" }, { status: 404 });
    }

    return NextResponse.json({ messages: chat.messages });
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    return NextResponse.json(
      { message: "Error fetching chat messages" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { chatId: string } }
) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { message } = await request.json();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const chat = user.chats.id(params.chatId);

    if (!chat) {
      return NextResponse.json({ message: "Chat not found" }, { status: 404 });
    }

    // Add user message to chat
    chat.messages.push({ role: "user", content: message } as ChatMessage);

    // Generate AI response
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: chat.messages.map((msg: ChatMessage) => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    const aiReply = completion.choices[0].message.content;

    // Add AI response to chat
    chat.messages.push({ role: "assistant", content: aiReply } as ChatMessage);

    // Update chat title if it's the first message
    if (chat.messages.length === 2) {
      chat.title = message.slice(0, 30) + (message.length > 30 ? "..." : "");
    }

    await user.save();

    return NextResponse.json({ reply: aiReply });
  } catch (error) {
    console.error("Error processing chat message:", error);
    return NextResponse.json(
      { message: "Error processing chat message" },
      { status: 500 }
    );
  }
}
