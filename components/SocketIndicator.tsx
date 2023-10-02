"use client";

import { useSocket } from "@/components/providers/SocketProvider";
import { Badge } from "@/components/ui/badge";

export const SocketIndicator = () => {
  const { isConnected } = useSocket();
  if (!isConnected) {
    return (
      <Badge className="bg-yellow-600 text-white">
        Disconnected : Polling every 1s
      </Badge>
    );
  }

  return <Badge className="bg-emerald-600 text-white">Connected</Badge>;
};
