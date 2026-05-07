import { PropsWithChildren } from 'react';
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Network } from '@aptos-labs/ts-sdk';
import { ToastProvider } from '../hooks/useToast';

const queryClient = new QueryClient();

export default function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <AptosWalletAdapterProvider
        autoConnect={false}
        dappConfig={{ network: Network.DEVNET }}
        onError={(error) => {
          console.error('Wallet error:', error);
        }}
      >
        <ToastProvider>
          {children}
        </ToastProvider>
      </AptosWalletAdapterProvider>
    </QueryClientProvider>
  );
}
