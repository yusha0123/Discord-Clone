"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/useModalStore";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useParams, useRouter } from "next/navigation";
import qs from "query-string";

export const DeleteChannelModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "deleteChannel";
  const { server, channel } = data;
  const router = useRouter();
  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: (url: string) => {
      return axios.delete(url);
    },
    onSuccess: () => {
      router.refresh();
      router.push(`/servers/${server?.id}`);
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
      onClose();
    },
  });

  const handleDelete = () => {
    const url = qs.stringifyUrl({
      url: `/api/channels/${channel?.id}`,
      query: {
        serverId: server?.id,
      },
    });
    mutation.mutate(url);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Delete Channel
          </DialogTitle>
          <DialogDescription className="text-zinc-500 text-center">
            Are you sure you want to Delete{" "}
            <span className="text-indigo-500 font-semibold">
              #{channel?.name}
            </span>{" "}
            ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4 ">
          <div className="flex items-center justify-between w-full">
            <Button
              disabled={mutation.isLoading}
              onClick={onClose}
              variant={"primary"}
            >
              Cancel
            </Button>
            <Button
              isLoading={mutation.isLoading}
              variant={"destructive"}
              onClick={handleDelete}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
