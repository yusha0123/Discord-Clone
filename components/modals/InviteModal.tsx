"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/useModalStore";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useOrigin } from "@/hooks/useOrigin";
import { useState } from "react";
import axios from "axios";
import { useToast } from "../ui/use-toast";
import { useMutation } from "@tanstack/react-query";

export const InviteModal = () => {
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const origin = useOrigin();
  const { server } = data;
  const { toast } = useToast();
  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;
  const isModalOpen = isOpen && type === "invite";
  const [copied, isCopied] = useState(false);
  const mutation = useMutation({
    mutationFn: () => {
      return axios.patch(`/api/servers/${server?.id}/invite-code`);
    },
    onSuccess: (response) => {
      onOpen("invite", { server: response.data });
    },
    onError: (error) => {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    },
  });

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    isCopied(true);

    setTimeout(() => {
      isCopied(false);
    }, 1500);
  };

  const generateNewLink = () => {
    mutation.mutate();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Invite Friends
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label className="uppercase text-zinc-500 dark:text-secondary/70 text-xs font-bold">
            Server Invite Link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
              value={inviteUrl}
              disabled={mutation.isLoading}
              readOnly
            />
            <Button
              size={"icon"}
              onClick={onCopy}
              disabled={mutation.isLoading}
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
          <Button
            className="text-xs text-zinc-500 mt-4"
            size={"sm"}
            variant={"link"}
            isLoading={mutation.isLoading}
            onClick={generateNewLink}
          >
            Generate a New Link
            <RefreshCw className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
