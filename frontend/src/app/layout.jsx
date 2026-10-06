import '../index.css';
import '../App.css';
import { AppProvider } from '../context/AppContext';
import ClientShell from '../components/ClientShell';

export const metadata = {
  title: 'ACE Logistics — Global Multi-Modal Freight & Tracking Network',
  description: 'Enterprise logistics, real-time shipment telemetry, automated customs clearance, and global air/ocean freight solutions across 140+ countries.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/ace-emblem.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body suppressHydrationWarning>
        <AppProvider>
          <ClientShell>
            {children}
          </ClientShell>
        </AppProvider>
      </body>
    </html>
  );
}
