"use client";

import qs from "query-string";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Phone, PhoneOff } from "lucide-react";
import { ActionTooltip } from "@/components/ActionTooltip";

export const ChatAudioButton = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isAudio = searchParams?.get("audio");
  const Icon = isAudio ? PhoneOff : Phone;
  const label = isAudio ? "End audio call" : "Start audio call";

  const handleClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname || "",
        query: {
          audio: isAudio ? undefined : true,
        },
      },
      { skipNull: true }
    );
    router.push(url);
  };
  return (
    <ActionTooltip side="bottom" label={label}>
      <button
        onClick={handleClick}
        className="hover:opacity-75 transition mr-4"
      >
        <Icon className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
      </button>
    </ActionTooltip>
  );
};
