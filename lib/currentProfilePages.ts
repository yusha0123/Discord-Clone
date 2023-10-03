//since pages folder have some restrictions therefore we have to create a different version of our helper function currentProfile

import { getAuth } from "@clerk/nextjs/server";
import { db } from "./db";
import { NextApiRequest } from "next";

export const currentProfilePages = async (req: NextApiRequest) => {
  const { userId } = getAuth(req);
  if (!userId) return null;
  try {
    const profile = await db.profile.findUnique({
      where: {
        userId,
      },
    });
    return profile;
  } catch (error) {
    console.log(error);
  }
};
