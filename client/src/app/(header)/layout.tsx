import { Suspense } from "react";
import Header from "@/components/Header";

export default function HeaderLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <Suspense
        fallback={
          <div className="flex h-96 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          </div>
        }
      >
        <div>{children}</div>
      </Suspense>
    </>
  );
}
