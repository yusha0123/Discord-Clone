import { useEffect, useState } from "react";

export const useOrigin = () => {
  const [mounted, isMounted] = useState(false);
  useEffect(() => {
    isMounted(true);
  }, []);

  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";

  if (!mounted) return "";

  return origin;
};
