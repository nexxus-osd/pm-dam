import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cn } from '@/utils/cn';
import { Sidebar } from '@/components/sidebar';

// Configuración de la fuente Inter optimizada
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
    title: 'PM/DAM Premium Dashboard',
    description: 'Sistema Integral de Gestión de Proyectos y Activos Digitales potenciado por IA',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es" className="dark">
            <body className={cn(inter.variable, "min-h-screen bg-background font-sans antialiased text-foreground")}>
                <div className="flex h-screen overflow-hidden">
                    <Sidebar />
                    <main className="flex-1 overflow-y-auto bg-background transition-all duration-300">
                        <div className="container mx-auto max-w-7xl p-6 lg:p-8">
                            {children}
                        </div>
                    </main>
                </div>
            </body>
        </html>
    );
}
