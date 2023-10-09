import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { db } from "./db";

export const newProfile = async () => {
  try {
    const user = await currentUser();

    if (!user) {
      return redirectToSignIn();
    }

    const profile = await db.profile.findUnique({
      where: {
        userId: user.id,
      },
    });
    if (profile) {
      return profile;
    }

    const newUser = await db.profile.create({
      data: {
        userId: user.id,
        name:
          user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : user.firstName || "",
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0]?.emailAddress || "",
      },
    });

    return newUser;
  } catch (error) {
    console.log(error);
  }
};
