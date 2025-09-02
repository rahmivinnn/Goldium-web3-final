import type { AppProps } from 'next/app';
import { WalletContextProvider } from '../lib/wallet-context';
import TransactionNotifications from '../components/TransactionNotifications';
import SolscanTracker from '../components/SolscanTracker';
import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WalletContextProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Component {...pageProps} />
        <TransactionNotifications />
        <SolscanTracker />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(0, 0, 0, 0.8)',
              color: '#fff',
              border: '1px solid rgba(255, 204, 26, 0.3)',
            },
          }}
        />
      </div>
    </WalletContextProvider>
  );
}
