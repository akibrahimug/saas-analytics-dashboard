"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface DemoContext {
  isDemo: boolean;
  exitDemo: () => void;
}

const DemoModeContext = createContext<DemoContext>(null!);

export function DemoModeProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (searchParams.get("demo") === "true") {
      sessionStorage.setItem("demoMode", "true");
      setIsDemo(true);
    } else if (sessionStorage.getItem("demoMode") === "true") {
      setIsDemo(true);
    }
  }, [searchParams]);

  const exitDemo = () => {
    sessionStorage.removeItem("demoMode");
    setIsDemo(false);
    router.replace(router.pathname, undefined, { shallow: true });
  };

  return (
    <DemoModeContext.Provider value={{ isDemo, exitDemo }}>
      {children}
    </DemoModeContext.Provider>
  );
}

export function useDemoMode() {
  return useContext(DemoModeContext);
}
