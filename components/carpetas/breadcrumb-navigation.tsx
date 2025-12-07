'use client';

import Link from 'next/link';
import { ChevronRight, Home, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BreadcrumbItem {
  id: string;
  nombre: string;
  type: 'project' | 'folder';
}

interface BreadcrumbNavigationProps {
  projectId: string;
  projectName: string;
  currentFolder?: {
    id: string;
    nombre: string;
  } | null;
  folderPath: BreadcrumbItem[];
  onItemClick: (item: BreadcrumbItem) => void;
}

export function BreadcrumbNavigation({
  projectId,
  projectName,
  currentFolder,
  folderPath,
  onItemClick
}: BreadcrumbNavigationProps) {
  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-4">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 px-2 text-muted-foreground hover:text-foreground"
        onClick={() => onItemClick({ id: projectId, nombre: projectName, type: 'project' })}
      >
        <Home className="h-4 w-4" />
      </Button>
      
      <ChevronRight className="h-4 w-4" />
      
      {folderPath.map((folder, index) => (
        <div key={folder.id} className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-muted-foreground hover:text-foreground"
            onClick={() => onItemClick(folder)}
          >
            <Folder className="h-4 w-4 mr-1" />
            {folder.nombre}
          </Button>
          
          <ChevronRight className="h-4 w-4" />
        </div>
      ))}
      
      {currentFolder && (
        <span className="font-medium text-foreground truncate max-w-xs">
          {currentFolder.nombre}
        </span>
      )}
    </nav>
  );
}