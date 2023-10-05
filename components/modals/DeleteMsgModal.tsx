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
import qs from "query-string";

export const DeleteMsgModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "deleteMsg";
  const { apiUrl, query } = data;
  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: (url: string) => {
      return axios.delete(url);
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
      url: apiUrl || "",
      query,
    });
    mutation.mutate(url);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Delete Message
          </DialogTitle>
          <DialogDescription className="text-zinc-500 text-center">
            Are you sure you want to Delete this Message?
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
