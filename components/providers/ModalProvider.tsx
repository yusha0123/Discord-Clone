"use client";

import { CreateServerModal } from "@/components/modals/CreateServerModal";
import { useEffect, useState } from "react";
import { InviteModal } from "@/components/modals/InviteModal";

export const ModalProvider = () => {
  const [isMounted, setisMounted] = useState(false);

  useEffect(() => {
    setisMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CreateServerModal />
      <InviteModal />
    </>
  );
};
