"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/useModalStore";
import { ServerWithMembersWithProfile } from "@/types";
import { MemberRole } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  Check,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
  UserX2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import qs from "query-string";
import { useState } from "react";
import { UserAvatar } from "../UserAvatar";
import { ScrollArea } from "../ui/scroll-area";
import { useToast } from "../ui/use-toast";

const roleIcon = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="h-4 w-4  text-indigo-500" />,
  ADMIN: <ShieldAlert className="h-4 w-4  text-rose-500" />,
};

export const MembersModal = () => {
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const { server } = data as { server: ServerWithMembersWithProfile };
  const { toast } = useToast();
  const router = useRouter();
  const [loadingId, setLoadingId] = useState("");
  const isModalOpen = isOpen && type === "members";
  const changeRoleMutation = useMutation({
    mutationFn: ({ url, role }: { url: string; role: MemberRole }) => {
      return axios.patch(url, { role });
    },
    onSuccess: (response) => {
      router.refresh();
      onOpen("members", { server: response.data });
    },
    onError: (error) => {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    },
    onSettled: () => {
      setLoadingId("");
    },
  });

  const kickMemberMutation = useMutation({
    mutationFn: (url: string) => {
      return axios.delete(url);
    },
    onSuccess: (response) => {
      router.refresh();
      onOpen("members", { server: response.data });
    },
    onError: (error) => {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    },
    onSettled: () => {
      setLoadingId("");
    },
  });

  const changeRole = (memberId: string, role: MemberRole) => {
    setLoadingId(memberId);
    const url = qs.stringifyUrl({
      url: `/api/members/${memberId}`,
      query: {
        serverId: server.id,
      },
    });
    changeRoleMutation.mutate({ url, role });
  };

  const kickMember = (memberId: string) => {
    setLoadingId(memberId);
    const url = qs.stringifyUrl({
      url: `/api/members/${memberId}`,
      query: {
        serverId: server?.id,
      },
    });

    kickMemberMutation.mutate(url);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {server?.members?.length}{" "}
            {server?.members?.length == 1 ? "Member" : "Members"}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[320px] pr-6">
          {server?.members?.map((member) => (
            <div key={member.id} className="flex items-center gap-x-2 mb-6">
              <UserAvatar src={member.profile.imageUrl} />
              <div className="flex flex-col gap-y-1">
                <div className="text-xs font-semibold flex items-center gap-x-1">
                  {member.profile.name}
                  {roleIcon[member.role]}
                </div>
                <p className="text-xs text-zinc-500">{member.profile.email}</p>
              </div>
              {server.profileId !== member.profileId &&
                loadingId !== member.id && (
                  <div className="ml-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className="h-4 w-4 text-zinc-500" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="left">
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="flex items-center">
                            <ShieldQuestion className="h-4 w-4 mr-2" />
                            <span>Role</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem
                                onClick={() => changeRole(member.id, "GUEST")}
                              >
                                <Shield className="h-4 w-4 mr-2" />
                                Guest
                                {member.role === "GUEST" && (
                                  <Check className="h-4 w-4 ml-1" />
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  changeRole(member.id, "MODERATOR")
                                }
                              >
                                <ShieldCheck className="h-4 w-4 mr-2" />
                                Moderator
                                {member.role === "MODERATOR" && (
                                  <Check className="h-4 w-4 ml-1" />
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => kickMember(member.id)}>
                          <UserX2 className="h-4 w-4 mr-2" />
                          Kick
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              {loadingId === member.id && (
                <Loader2 className="animate-spin text-zinc-500 ml-auto w-4 h-4" />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
