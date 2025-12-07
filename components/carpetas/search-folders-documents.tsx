'use client';

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Folder, FileText, File } from "lucide-react";
import { searchFoldersAndDocumentsAction } from "@/app/actions/folder-management";

interface SearchResult {
  carpetas: any[];
  documentos: any[];
}

interface SearchFoldersDocumentsProps {
  projectId: string;
  onResultSelect: (item: any, type: 'carpeta' | 'documento') => void;
}

export function SearchFoldersDocuments({
  projectId,
  onResultSelect
}: SearchFoldersDocumentsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const result = await searchFoldersAndDocumentsAction(projectId, searchTerm);
      if (result.success) {
        setResults(result.data as SearchResult);
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error('Error al buscar:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Buscar carpetas y documentos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={loading}>
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {results && (
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {results.carpetas.length === 0 && results.documentos.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No se encontraron resultados para "{searchTerm}"
            </p>
          ) : (
            <>
              {results.carpetas.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Folder className="h-4 w-4" />
                    Carpetas
                  </h4>
                  <div className="space-y-1">
                    {results.carpetas.map((carpeta) => (
                      <div
                        key={carpeta.id}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/30 cursor-pointer transition-colors"
                        onClick={() => onResultSelect(carpeta, 'carpeta')}
                      >
                        <Folder className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">{carpeta.nombre}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {results.documentos.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Documentos
                  </h4>
                  <div className="space-y-1">
                    {results.documentos.map((documento) => (
                      <div
                        key={documento.id}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/30 cursor-pointer transition-colors"
                        onClick={() => onResultSelect(documento, 'documento')}
                      >
                        {documento.nombre_archivo ? (
                          <File className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <FileText className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="text-sm">{documento.nombre}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}