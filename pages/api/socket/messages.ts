import { currentProfilePages } from "@/lib/currentProfilePages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not Allowed!" });
  }

  try {
    const profile = await currentProfilePages(req);
    const { content, fileUrl } = req.body;
    const { serverId, channelId } = req.query;

    if (!profile) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized User!" });
    }

    if (!serverId || !channelId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing Parameters!" });
    }

    if (!content) {
      return res
        .status(400)
        .json({ success: false, message: "Content cannot be Empty!" });
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });

    if (!channel) {
      return res
        .status(404)
        .json({ success: false, message: "Channel not Found!" });
    }

    const member = server?.members.find(
      (member) => member.profileId === profile.id
    );

    if (!member) {
      return res
        .status(404)
        .json({ success: false, message: "Member not Found!" });
    }

    const message = await db.message.create({
      data: {
        content,
        fileUrl,
        channelId: channelId as string,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const channelKey = `chat:${channelId}:messages`;
    res?.socket?.server?.io?.emit(channelKey, message);
  } catch (error) {
    console.log("SERVER_ERROR", error);
    return res
      .status(500)
      .json({ success: false, message: "Interal Server Error" });
  }
}
