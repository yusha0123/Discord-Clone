"use client";

import { useSocket } from "@/components/providers/SocketProvider";
import { Badge } from "@/components/ui/badge";

export const SocketIndicator = () => {
  const { isConnected } = useSocket();
  if (!isConnected) {
    return (
      <Badge className="bg-yellow-600 hover:bg-yellow-700 text-white">
        Disconnected
      </Badge>
    );
  }

  return (
    <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white">
      Connected
    </Badge>
  );
};
