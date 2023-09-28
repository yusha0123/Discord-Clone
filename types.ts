import { Server, Profile, Member } from "@prisma/client";

export type ServerWithMembersWithProfile = Server & {
  members: (Member & { profile: Profile })[];
};
