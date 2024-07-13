//src/app/api/chat/[chatId]/title/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import User from "@/models/User";
import connectDB from "@/lib/mongodb";

export async function PUT(
  request: NextRequest,
  { params }: { params: { chatId: string } }
) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title } = await request.json();
    const user = await User.findOneAndUpdate(
      { email: session.user.email, "chats._id": params.chatId },
      { $set: { "chats.$.title": title } },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ message: "Chat not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Chat title updated successfully" });
  } catch (error) {
    console.error("Error updating chat title:", error);
    return NextResponse.json(
      { message: "Error updating chat title" },
      { status: 500 }
    );
  }
}
