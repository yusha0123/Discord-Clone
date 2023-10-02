import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface Props {
  params: {
    serverId: string;
  };
}

const ServerPage = async ({ params }: Props) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          name: "general",
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  const generalChannel = server?.channels[0];

  if (generalChannel?.name !== "general") {
    //check if channel name is general or not , just to stay on safe side
    return null;
  }

  //redirect the user to general channel page
  return redirect(`/servers/${params.serverId}/channels/${generalChannel?.id}`);
};

export default ServerPage;
