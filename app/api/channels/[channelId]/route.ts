import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  const { searchParams } = new URL(req.url);
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized User!", { status: 401 });
    }

    const serverId = searchParams.get("serverId");
    if (!serverId) {
      return new NextResponse("Server Id is Required!", { status: 400 });
    }

    if (!params.channelId) {
      return new NextResponse("Channel Id is Required!", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          delete: {
            id: params.channelId,
            name: {
              not: "general", //don't allow deletion of general channel
            },
          },
        },
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_ERROR]", error);
    return new NextResponse("Internal Server Error!", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  const { searchParams } = new URL(req.url);
  try {
    const { name, type } = await req.json();
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized User!", { status: 401 });
    }

    const serverId = searchParams.get("serverId");
    if (!serverId) {
      return new NextResponse("Server Id is Required!", { status: 400 });
    }

    if (!params.channelId) {
      return new NextResponse("Channel Id is Required!", { status: 400 });
    }

    if (name === "general") {
      return new NextResponse("General channel cannot be Edited!", {
        status: 400,
      });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          update: {
            where: {
              id: params.channelId,
              NOT: {
                name: "general",
              },
            },
            data: {
              name,
              type,
            },
          },
        },
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_ERROR]", error);
    return new NextResponse("Internal Server Error!", { status: 500 });
  }
}
