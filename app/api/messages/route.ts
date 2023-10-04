import { currentProfile } from "@/lib/currentProfile";
import { NextResponse } from "next/server";
import { Message } from "@prisma/client";
import { db } from "@/lib/db";

const Msg_Per_Page = 10;

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const channelId = searchParams.get("channelId");

    if (!profile) {
      return new NextResponse("Unauthorized User!", { status: 401 });
    }
    if (!channelId) {
      return new NextResponse("Channel Id is Missing!", { status: 400 });
    }

    let messages: Message[] = [];

    if (cursor) {
      messages = await db.message.findMany({
        take: Msg_Per_Page,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      messages = await db.message.findMany({
        take: Msg_Per_Page,
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    let nextCursor = null;
    if (messages.length === Msg_Per_Page) {
      nextCursor = messages[Msg_Per_Page - 1].id;
    }

    return NextResponse.json({
      items: messages,
      nextCursor,
    });
  } catch (error) {
    console.log("SERVER_ERROR", error);
    return new NextResponse("Internal server error!", { status: 500 });
  }
}
