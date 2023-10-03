"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FileUpload from "../FileUpload";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { useModal } from "@/hooks/useModalStore";
import qs from "query-string";

const formShema = z.object({
  fileUrl: z.string().min(1, {
    message: "Attachment can't be empty!",
  }),
});

export const MsgFileModal = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { isOpen, onClose, type, data } = useModal();
  const { apiUrl, query } = data;
  const isModalOpen = isOpen && type === "msgFile";
  const mutation = useMutation({
    mutationFn: ({
      url,
      values,
    }: {
      url: string;
      values: z.infer<typeof formShema>;
    }) => {
      return axios.post(url, {
        ...values,
        content: values.fileUrl,
      });
    },
    onSuccess: () => {
      form.reset();
      router.refresh();
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
      handleClose();
    },
  });

  const form = useForm({
    resolver: zodResolver(formShema),
    defaultValues: {
      fileUrl: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formShema>) => {
    const url = qs.stringifyUrl({
      url: apiUrl || "",
      query,
    });
    mutation.mutate({ url, values });
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Add an Attachment
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Send a file as a Message
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center text-center justify-center">
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="messageFile"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4 ">
              <Button isLoading={mutation.isLoading} variant={"primary"}>
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
