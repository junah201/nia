import { Amplify } from 'aws-amplify';
import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';

import { AwsConfig } from '@/constants/aws';

const queryClient = new QueryClient();
Amplify.configure(AwsConfig);

const Provider = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
};

export default Provider;