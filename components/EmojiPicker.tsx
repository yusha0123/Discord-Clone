import { Smile } from "lucide-react";
import EmojiPicker, { Theme, EmojiClickData } from "emoji-picker-react"; // Import as Picker
import { useTheme } from "next-themes";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Props {
  onChange: (value: string) => void;
}

export const Picker = ({ onChange }: Props) => {
  const { resolvedTheme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger>
        <Smile className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
      </PopoverTrigger>
      <PopoverContent
        side="right"
        sideOffset={40}
        className="bg-transparent border-none shadow-none drop-shadow-none mb-16"
      >
        <EmojiPicker
          theme={resolvedTheme as Theme}
          onEmojiClick={(emoji: EmojiClickData) => onChange(emoji.emoji)}
        />
      </PopoverContent>
    </Popover>
  );
};
