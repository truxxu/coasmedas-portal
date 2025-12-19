import { UserProvider, UIProvider, WelcomeBarProvider } from '@/src/contexts';
import { Sidebar, TopBar, WelcomeBar, SessionFooter } from '@/src/organisms';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <UIProvider>
        <WelcomeBarProvider>
          <div className="min-h-screen">
            <Sidebar />
            <div className="flex flex-col lg:ml-[268px] min-h-screen">
              <TopBar />
              <WelcomeBar />
              <main className="flex-1 bg-brand-light-blue p-8 overflow-auto">
                {children}
              </main>
              <SessionFooter />
            </div>
          </div>
        </WelcomeBarProvider>
      </UIProvider>
    </UserProvider>
  );
}
