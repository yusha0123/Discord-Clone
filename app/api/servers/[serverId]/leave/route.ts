import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized Access", { status: 401 });
    }

    if (!params.serverId) {
      return new NextResponse("Server Id is Required!", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: {
          not: profile.id, //admins cannot leave the server
        },
        members: {
          some: {
            profileId: profile.id, //confirm if the person is a part of server
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[Server Error]", error);
    return new NextResponse("Interval Server Error", { status: 500 });
  }
}
