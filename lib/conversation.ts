import { db } from "@/lib/db";

const checkIfConversationExists = async (
  memberOneId: string,
  memberTwoId: string
) => {
  try {
    return await db.conversation.findFirst({
      where: {
        AND: [{ memberOneId: memberOneId }, { memberTwoId: memberTwoId }],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  } catch (error) {
    console.log(error);
    return null;
  }
};

const createConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    return await db.conversation.create({
      data: {
        memberOneId,
        memberTwoId,
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const findOrCreateConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  let conversation =
    (await checkIfConversationExists(memberOneId, memberTwoId)) ||
    (await checkIfConversationExists(memberTwoId, memberOneId));

  if (!conversation) {
    conversation = await createConversation(memberOneId, memberTwoId);
  }

  return conversation;
};
