import './styles.css';
import { Providers } from './providers';
import { Toaster } from 'sonner';

export const metadata = {
  title: 'x | da la da la',
  description: 'Generated by create-nx-workspace',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Toaster />
          <main className="dark text-foreground bg-background">{children}</main>
        </Providers>
      </body>
    </html>
  );
}