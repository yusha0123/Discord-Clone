import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="h-screen flex flex-col items-center w-full justify-center">
      <Loader2 className="h-10 w-10 text-zinc-500 animate-spin" />
    </div>
  );
};

export default Loading;
