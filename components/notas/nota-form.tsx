'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, X } from 'lucide-react';

interface NotaFormProps {
  initialValues?: {
    titulo: string;
    contenido: string;
    color: string;
  };
  onSubmit: (data: { titulo: string; contenido: string; color: string }) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const colores = [
  'bg-yellow-100 border-yellow-300',
  'bg-blue-100 border-blue-300',
  'bg-green-100 border-green-300',
  'bg-pink-100 border-pink-300',
  'bg-purple-100 border-purple-300',
  'bg-indigo-100 border-indigo-300'
];

export function NotaForm({ 
  initialValues = { titulo: '', contenido: '', color: 'bg-yellow-100 border-yellow-300' },
  onSubmit,
  onCancel,
  isEditing = false
}: NotaFormProps) {
  const [formData, setFormData] = useState(initialValues);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {isEditing ? 'Editar Nota' : 'Nueva Nota'}
        </h3>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={onCancel}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div>
        <Input
          placeholder="Título de la nota"
          value={formData.titulo}
          onChange={(e) => setFormData({...formData, titulo: e.target.value})}
          required
        />
      </div>
      
      <div>
        <textarea
          placeholder="Contenido de la nota..."
          value={formData.contenido}
          onChange={(e) => setFormData({...formData, contenido: e.target.value})}
          className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>
      
      <div>
        <p className="text-sm font-medium mb-2">Color de la nota</p>
        <div className="flex gap-2">
          {colores.map(color => (
            <button
              key={color}
              type="button"
              onClick={() => setFormData({...formData, color})}
              className={`w-8 h-8 rounded-full border-2 ${color.split(' ')[0]} ${
                formData.color === color ? 'ring-2 ring-primary ring-offset-2' : ''
              }`}
            />
          ))}
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button type="submit" className="gap-2">
          <Save className="h-4 w-4" />
          {isEditing ? 'Actualizar' : 'Guardar'}
        </Button>
      </div>
    </form>
  );
}