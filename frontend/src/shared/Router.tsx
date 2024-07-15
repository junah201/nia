import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

import Loadable from '@/components/Loadable';

const ROUTES = Object.freeze([
  {
    PATH: '/',
    ELEMENT: Loadable(() => <>/</>),
  },
  {
    PATH: '/login',
    ELEMENT: Loadable(() => <>/login</>),
  },
  {
    PATH: '/logout',
    ELEMENT: Loadable(() => <>/logout</>),
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
      {ROUTES.map(({ PATH, ELEMENT }) => (
        <Route key={PATH} path={PATH} element={<ELEMENT />} />
      ))}
    </Routes>
  );
};

export default Router;