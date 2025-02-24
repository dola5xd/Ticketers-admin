import { useEffect, useState } from "react";

export function useDark() {
  const [isDark, setisDark] = useState<boolean>(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else document.documentElement.classList.remove("dark");
  }, [isDark]);

  return { isDark, setisDark };
}
