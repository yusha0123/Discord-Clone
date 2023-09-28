import ServerSideBar from "@/components/server/ServerSideBar";
import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface props {
  children: React.ReactNode;
  params: { serverId: string };
}

const ServerIdLayout = async ({ children, params }: props) => {
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
  });

  if (!server) {
    return redirect("/");
  }

  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-60 z-5 flex-col fixed inset-y-0">
        <ServerSideBar serverId={params.serverId} />
      </div>
      <main className="h-full md:pl-60 ">{children}</main>
    </div>
  );
};

export default ServerIdLayout;
