import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  const { searchParams } = new URL(req.url);
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized User!", { status: 401 });
    }

    const { role } = await req.json();

    const serverId = searchParams.get("serverId");

    if (!serverId) {
      return new NextResponse("Server Id is Required!", { status: 400 });
    }

    if (!params.memberId) {
      return new NextResponse("Member Id is Required!", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: params.memberId,
              profileId: {
                //current logged in user can't change its own role
                not: profile.id,
              },
            },
            data: {
              role,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
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

export async function DELETE(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  const { searchParams } = new URL(req.url);
  const serverId = searchParams.get("serverId");
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized User!", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server Id is Required!", { status: 400 });
    }
    if (!params.memberId) {
      return new NextResponse("Member Id is Required!", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          deleteMany: {
            id: params.memberId,
            profileId: {
              not: profile.id,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
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
