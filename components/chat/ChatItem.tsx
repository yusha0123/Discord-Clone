"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Member, MemberRole, Profile } from "@prisma/client";
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import { UserAvatar } from "@/components/UserAvatar";
import { ActionTooltip } from "@/components/ActionTooltip";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { cn, imageExtensions } from "@/lib/utils";
import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useModal } from "@/hooks/useModalStore";
import { useParams, useRouter } from "next/navigation";

interface Props {
  id: string;
  content: string;
  member: Member & {
    profile: Profile;
  };
  timestamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const roleIcon = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
};

const formSchema = z.object({
  content: z.string().min(1),
});

export const ChatItem = ({
  id,
  content,
  member,
  timestamp,
  fileUrl,
  deleted,
  currentMember,
  isUpdated,
  socketUrl,
  socketQuery,
}: Props) => {
  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = !deleted && isOwner && !fileUrl;
  const fileExtension = fileUrl ? fileUrl.split(".").pop()?.toLowerCase() : "";
  const isImage = imageExtensions.includes(fileExtension!);
  const isFile = fileUrl && !isImage;
  const fileName =
    fileUrl && isFile ? fileUrl.match(/[^.]+$/)![0].toUpperCase() : "";
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const { onOpen } = useModal();
  const params = useParams();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: ({
      url,
      values,
    }: {
      url: string;
      values: z.infer<typeof formSchema>;
    }) => {
      return axios.patch(url, values);
    },
    onSuccess: () => {
      setIsEditing(false);
      form.reset();
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: content,
    },
  });

  useEffect(() => {
    form.reset({
      content: content,
    });
    // eslint-disable-next-line
  }, [content]);

  const submit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    const url = qs.stringifyUrl({
      url: `${socketUrl}/${id}`,
      query: socketQuery,
    });
    mutation.mutate({ values, url });
  };

  const handleMemberClick = () => {
    if (member.id === currentMember.id) return;

    router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
  };

  useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (event.key === "Escape" || event.keyCode === 27) {
        setIsEditing(false);
      }
    };
    window.addEventListener("keydown", handleKeyPress);

    return () => window.removeEventListener("keyDown", handleKeyPress);
  }, []);

  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
      <div className="group flex gap-x-2 items-start w-full">
        <div
          className="cursor-pointer hover:drop-shadow-md transition"
          onClick={handleMemberClick}
        >
          <UserAvatar src={member.profile.imageUrl} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p
                className="font-semibold text-sm hover:underline cursor-pointer"
                onClick={handleMemberClick}
              >
                {member.profile.name}
              </p>
              <ActionTooltip label={member.role}>
                {roleIcon[member.role]}
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </span>
          </div>
          {isImage && (
            <a
              href={fileUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
            >
              <Image
                src={fileUrl!}
                alt={content}
                fill
                className="object-cover"
              />
            </a>
          )}
          {isFile && (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
              <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
              >
                {fileName} File
              </a>
            </div>
          )}
          {!fileUrl && !isEditing && (
            <p
              className={cn(
                "text-md text-zinc-600 dark:text-zinc-300 mt-1",
                deleted &&
                  "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
              )}
            >
              {content}
              {isUpdated && !deleted && (
                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                  (edited)
                </span>
              )}
            </p>
          )}
          {!fileUrl && isEditing && (
            <Form {...form}>
              <form
                className="flex items-center w-full gap-x-2 pt-2"
                onSubmit={form.handleSubmit(submit)}
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            disabled={mutation.isLoading}
                            className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                            placeholder="Edited message"
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  disabled={mutation.isLoading}
                  size="sm"
                  variant="primary"
                >
                  Save
                </Button>
              </form>
              <span className="text-[10px] mt-1 text-zinc-400">
                Press escape to cancel, enter to save
              </span>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div className="hidden group-hover:flex items-center gap-x-5 absolute p-1 -top-2 right-5  bg-white dark:bg-zinc-800 border rounded-sm">
          {canEditMessage && (
            <ActionTooltip label="Edit">
              <Edit
                className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-300 transition"
                onClick={() => setIsEditing(true)}
              />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <Trash
              className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-300 transition"
              onClick={() =>
                onOpen("deleteMsg", {
                  apiUrl: `${socketUrl}/${id}`,
                  query: socketQuery,
                })
              }
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
};
