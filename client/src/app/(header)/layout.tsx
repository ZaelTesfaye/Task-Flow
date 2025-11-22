import { Suspense } from "react";
import Header from "@/components/Header";

export default function HeaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-96">
            <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
          </div>
        }
      >
        <div>{children}</div>
      </Suspense>
    </>
  );
}
