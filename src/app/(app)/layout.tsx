import { AppStoreProvider } from "@/components/app-store";
import { Header } from "@/components/shell/header";
import { MobileTabBar } from "@/components/shell/mobile-tabbar";
import { NotificationPanel } from "@/components/shell/notification-panel";
import { SearchDialog } from "@/components/shell/search-dialog";
import { Sidebar } from "@/components/shell/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppStoreProvider>
      <Sidebar />
      <div className="min-h-screen lg:pl-[228px]">
        <Header />
        <main className="mx-auto w-full max-w-[1440px] px-4 pb-24 pt-5 lg:px-6 lg:pb-10">
          {children}
        </main>
      </div>
      <MobileTabBar />
      <NotificationPanel />
      <SearchDialog />
    </AppStoreProvider>
  );
}
