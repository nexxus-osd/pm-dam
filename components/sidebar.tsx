'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Archive, 
  Bot, 
  Wallet, 
  Workflow,
  User
} from 'lucide-react';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Proyectos',
    href: '/proyectos',
    icon: FolderKanban,
  },
  {
    name: 'Activos Digitales',
    href: '/activos',
    icon: Archive,
  },
  {
    name: 'Herramientas AI',
    href: '/herramientas',
    icon: Bot,
  },
  {
    name: 'Finanzas',
    href: '/finanzas',
    icon: Wallet,
  },
  {
    name: 'Workflows',
    href: '/workflows',
    icon: Workflow,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-col border-r border-border bg-card px-4 py-6 md:flex">
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
          P
        </div>
        <span className="text-xl font-bold tracking-tight">PM/DAM</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors flex items-center gap-3 ${
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <div className="flex items-center gap-3 rounded-md bg-muted/50 p-3">
          <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
            <User className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium">Admin User</span>
            <span className="text-[10px] text-muted-foreground">admin@pmdam.com</span>
          </div>
        </div>
      </div>
    </aside>
  );
}