import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/session";
import { Header } from "@/components/layout/header";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f3f5] font-sans">
      <Header username={session.username} />
      
      {/* Full-width container with minimal margins to use maximum screen space */}
      <main className="flex-1 w-full px-2 sm:px-3 py-3">
        {children}
      </main>

      {/* Clean Compact Full-width Footer */}
      <footer className="border-t border-neutral-300 bg-white py-3 mt-auto shadow-xs">
        <div className="w-full px-2 sm:px-3 text-center space-y-0.5 text-xs text-neutral-600">
          <div className="flex items-center justify-center gap-2 font-semibold text-neutral-900">
            <span>TrackLet</span>
            <span className="text-neutral-400">&bull;</span>
            <span className="font-normal text-neutral-600">Personal Account &amp; Credit Usage Tracker</span>
          </div>
          <div className="text-[11px] text-neutral-500 font-medium">
            Developed by <span className="font-bold text-neutral-900">Naren</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
