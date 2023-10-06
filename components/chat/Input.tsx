"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input as CustumInput } from "@/components/ui/input";
import { Plus } from "lucide-react";
import axios from "axios";
import qs from "query-string";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useModal } from "@/hooks/useModalStore";
import { EmojiPicker } from "@/components/EmojiPicker";
import { useRouter } from "next/navigation";

interface Props {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: "conversation" | "channels";
}

const formShema = z.object({
  content: z.string().min(1),
});

export const Input = ({ apiUrl, query, name, type }: Props) => {
  const { toast } = useToast();
  const { onOpen } = useModal();
  const router = useRouter();
  const form = useForm<z.infer<typeof formShema>>({
    resolver: zodResolver(formShema),
    defaultValues: {
      content: "",
    },
  });
  const mutation = useMutation({
    mutationFn: ({
      url,
      values,
    }: {
      url: string;
      values: z.infer<typeof formShema>;
    }) => {
      return axios.post(url, values);
    },
    onError: (error) => {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    },
    onSuccess: () => {
      form.reset();
      router.refresh();
    },
  });

  const onSubmit = async (values: z.infer<typeof formShema>) => {
    const url = qs.stringifyUrl({
      url: apiUrl,
      query,
    });
    mutation.mutate({ url, values });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <button
                    type="button"
                    onClick={() => onOpen("msgFile", { apiUrl, query })}
                    className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center"
                  >
                    <Plus className="text-white dark:text-[#313338]" />
                  </button>
                  <CustumInput
                    disabled={mutation.isLoading}
                    className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                    placeholder={`Message ${
                      type === "conversation" ? name : "#" + name
                    }`}
                    {...field}
                    autoComplete="off"
                  />
                  <div className="absolute top-7 right-8">
                    <EmojiPicker
                      onChange={(emoji: string) =>
                        field.onChange(`${field.value} ${emoji}`)
                      }
                    />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
