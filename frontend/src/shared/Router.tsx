import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

import Loadable from '@/components/Loadable';
import MainLayout from '@/layouts/MainLayout';

const ROUTES = Object.freeze([
  {
    PATH: '/',
    ELEMENT: Loadable(lazy(() => import('@/pages/Home'))),
  },
  {
    PATH: '/login',
    ELEMENT: Loadable(lazy(() => import('@/pages/Login'))),
  },
  {
    PATH: '/logout',
    ELEMENT: Loadable(lazy(() => import('@/pages/Logout'))),
  },
  {
    PATH: '/token',
    ELEMENT: Loadable(lazy(() => import('@/pages/Token'))),
  },
  {
    // URL별 통계 페이지
    PATH: '/:slug/stats',
    ELEMENT: Loadable(() => <>/:slug/stats</>),
  },
  {
    // 전체 계정 통계 페이지
    PATH: '/@me/stats',
    ELEMENT: Loadable(() => <>/@me/stats</>),
  },
  {
    PATH: '/*',
    ELEMENT: Loadable(() => <>404</>),
  },
]);

export const Router = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {ROUTES.map(({ PATH, ELEMENT }) => (
          <Route key={PATH} path={PATH} element={<ELEMENT />} />
        ))}
      </Route>
    </Routes>
  );
};

export default Router;
