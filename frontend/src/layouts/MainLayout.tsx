import { Outlet } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { isLogin } from '@/lib/Login';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary p-4 flex justify-between items-center">
        <h1 className="text-lg font-bold text-white">NIA</h1>
        <Button variant="outline" asChild>
          {isLogin() ? (
            <a href="/logout" className="hover:underline font-bold">
              로그아웃
            </a>
          ) : (
            <a href="/login" className="hover:underline font-bold">
              로그인
            </a>
          )}
        </Button>
      </header>
      <main className="flex-grow flex flex-col items-center p-4">
        <Outlet />
      </main>
      <footer className="border-t p-6 text-center bg-secondary">
        <p>(C) 2024. Junah Kim (junah.dev@gmail.com) all rights reserved.</p>
      </footer>
    </div>
  );
};

export default MainLayout;
