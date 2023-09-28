import { ServerWithMembersWithProfile } from "@/types";
import { MemberRole } from "@prisma/client";

type Props = {
  server: ServerWithMembersWithProfile;
  role?: MemberRole;
};

const ServerHeader = ({ server, role }: Props) => {
  const isAdmin = (role = MemberRole.ADMIN);
  const isModerator = (role = MemberRole.MODERATOR);
  return <div>ServerHeader</div>;
};

export default ServerHeader;
