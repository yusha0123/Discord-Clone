import { newProfile } from "@/lib/newProfile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const SetupPage = async () => {
  const profile = await newProfile();
  //attempt to find the server in which the user is of member
  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return <div>Create a Server</div>;
};

export default SetupPage;
