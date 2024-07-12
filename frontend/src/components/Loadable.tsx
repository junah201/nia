import { Suspense } from 'react';

const Loadable = (Component: () => JSX.Element) => (props: object) => (
  <Suspense>
    <Component {...props} />
  </Suspense>
);

export default Loadable;
