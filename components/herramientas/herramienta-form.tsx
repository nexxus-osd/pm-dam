'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface HerramientaFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const CATEGORIAS = [
  'TEXTO', 'IMAGEN', 'VIDEO', 'AUDIO', 'CODIGO', 
  'ANALISIS', 'CHAT', 'PRODUCTIVIDAD'
];

const TIPOS_PRECIO = [
  'GRATIS', 'FREEMIUM', 'SUSCRIPCION', 'PAY_PER_USE', 'ONE_TIME'
];

const ESTADOS_SUSCRIPCION = [
  'ACTIVA', 'PAUSADA', 'CANCELADA', 'TRIAL'
];

export function HerramientaForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isLoading 
}: HerramientaFormProps) {
  const [formData, setFormData] = useState({
    nombre: initialData?.nombre || '',
    descripcion: initialData?.descripcion || '',
    url: initialData?.url || '',
    logo_url: initialData?.logo_url || '',
    url_documentacion: initialData?.url_documentacion || '',
    tipo_precio: initialData?.tipo_precio || 'GRATIS',
    costo_mensual: initialData?.costo_mensual || '',
    costo_anual: initialData?.costo_anual || '',
    costo_por_uso: initialData?.costo_por_uso || '',
    unidad_uso: initialData?.unidad_uso || '',
    moneda: initialData?.moneda || 'USD',
    plan_actual: initialData?.plan_actual || '',
    fecha_suscripcion: initialData?.fecha_suscripcion || '',
    fecha_renovacion: initialData?.fecha_renovacion || '',
    estado_suscripcion: initialData?.estado_suscripcion || '',
    caracteristicas: initialData?.caracteristicas || [],
    limitaciones: initialData?.limitaciones || [],
    casos_uso: initialData?.casos_uso || [],
    rating: initialData?.rating || '',
    reviews: initialData?.reviews || '',
    notas: initialData?.notas || '',
    tiene_api: initialData?.tiene_api || false,
    url_api: initialData?.url_api || '',
    api_key: initialData?.api_key || '',
    favorita: initialData?.favorita || false,
    activa: initialData?.activa || true,
    tiempo_ahorrado_estimado: initialData?.tiempo_ahorrado_estimado || '',
    productividad_ganada: initialData?.productividad_ganada || '',
  });

  const [categorias, setCategorias] = useState<string[]>(
    initialData?.categoria || []
  );
  const [nuevaCaracteristica, setNuevaCaracteristica] = useState('');
  const [nuevaLimitacion, setNuevaLimitacion] = useState('');
  const [nuevoCasoUso, setNuevoCasoUso] = useState('');

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCategoriaToggle = (categoria: string) => {
    setCategorias(prev => 
      prev.includes(categoria) 
        ? prev.filter(c => c !== categoria) 
        : [...prev, categoria]
    );
  };

  const agregarCaracteristica = () => {
    if (nuevaCaracteristica.trim()) {
      handleChange('caracteristicas', [...formData.caracteristicas, nuevaCaracteristica.trim()]);
      setNuevaCaracteristica('');
    }
  };

  const removerCaracteristica = (index: number) => {
    const nuevas = [...formData.caracteristicas];
    nuevas.splice(index, 1);
    handleChange('caracteristicas', nuevas);
  };

  const agregarLimitacion = () => {
    if (nuevaLimitacion.trim()) {
      handleChange('limitaciones', [...formData.limitaciones, nuevaLimitacion.trim()]);
      setNuevaLimitacion('');
    }
  };

  const removerLimitacion = (index: number) => {
    const nuevas = [...formData.limitaciones];
    nuevas.splice(index, 1);
    handleChange('limitaciones', nuevas);
  };

  const agregarCasoUso = () => {
    if (nuevoCasoUso.trim()) {
      handleChange('casos_uso', [...formData.casos_uso, nuevoCasoUso.trim()]);
      setNuevoCasoUso('');
    }
  };

  const removerCasoUso = (index: number) => {
    const nuevas = [...formData.casos_uso];
    nuevas.splice(index, 1);
    handleChange('casos_uso', nuevas);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      ...formData,
      categoria: categorias,
      costo_mensual: formData.costo_mensual ? parseFloat(formData.costo_mensual.toString()) : undefined,
      costo_anual: formData.costo_anual ? parseFloat(formData.costo_anual.toString()) : undefined,
      costo_por_uso: formData.costo_por_uso ? parseFloat(formData.costo_por_uso.toString()) : undefined,
      rating: formData.rating ? parseFloat(formData.rating.toString()) : undefined,
      tiempo_ahorrado_estimado: formData.tiempo_ahorrado_estimado ? parseFloat(formData.tiempo_ahorrado_estimado.toString()) : undefined,
      productividad_ganada: formData.productividad_ganada ? parseFloat(formData.productividad_ganada.toString()) : undefined,
    };
    
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nombre */}
        <div className="md:col-span-2">
          <Label htmlFor="nombre">Nombre *</Label>
          <Input
            id="nombre"
            value={formData.nombre}
            onChange={(e) => handleChange('nombre', e.target.value)}
            placeholder="Nombre de la herramienta"
            required
          />
        </div>

        {/* URL */}
        <div className="md:col-span-2">
          <Label htmlFor="url">URL *</Label>
          <Input
            id="url"
            value={formData.url}
            onChange={(e) => handleChange('url', e.target.value)}
            placeholder="https://ejemplo.com"
            type="url"
            required
          />
        </div>

        {/* Logo URL */}
        <div className="md:col-span-2">
          <Label htmlFor="logo_url">Logo URL</Label>
          <Input
            id="logo_url"
            value={formData.logo_url}
            onChange={(e) => handleChange('logo_url', e.target.value)}
            placeholder="https://ejemplo.com/logo.png"
            type="url"
          />
        </div>

        {/* Descripción */}
        <div className="md:col-span-2">
          <Label htmlFor="descripcion">Descripción *</Label>
          <Textarea
            id="descripcion"
            value={formData.descripcion}
            onChange={(e) => handleChange('descripcion', e.target.value)}
            placeholder="Descripción detallada de la herramienta"
            rows={4}
            required
          />
        </div>

        {/* Categorías */}
        <div className="md:col-span-2">
          <Label>Categorías *</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {CATEGORIAS.map(categoria => (
              <button
                key={categoria}
                type="button"
                onClick={() => handleCategoriaToggle(categoria)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  categorias.includes(categoria)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {categoria}
              </button>
            ))}
          </div>
          {categorias.length === 0 && (
            <p className="text-sm text-destructive mt-1">Selecciona al menos una categoría</p>
          )}
        </div>

        {/* Tipo de precio */}
        <div>
          <Label htmlFor="tipo_precio">Tipo de precio</Label>
          <Select 
            value={formData.tipo_precio} 
            onValueChange={(value) => handleChange('tipo_precio', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              {TIPOS_PRECIO.map(tipo => (
                <SelectItem key={tipo} value={tipo}>
                  {tipo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Costo mensual */}
        <div>
          <Label htmlFor="costo_mensual">Costo mensual</Label>
          <Input
            id="costo_mensual"
            value={formData.costo_mensual}
            onChange={(e) => handleChange('costo_mensual', e.target.value)}
            placeholder="0.00"
            type="number"
            step="0.01"
          />
        </div>

        {/* Moneda */}
        <div>
          <Label htmlFor="moneda">Moneda</Label>
          <Input
            id="moneda"
            value={formData.moneda}
            onChange={(e) => handleChange('moneda', e.target.value)}
            placeholder="USD"
            maxLength={3}
          />
        </div>

        {/* Estado de suscripción */}
        <div>
          <Label htmlFor="estado_suscripcion">Estado de suscripción</Label>
          <Select 
            value={formData.estado_suscripcion} 
            onValueChange={(value) => handleChange('estado_suscripcion', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              {ESTADOS_SUSCRIPCION.map(estado => (
                <SelectItem key={estado} value={estado}>
                  {estado}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Fecha de suscripción */}
        <div>
          <Label htmlFor="fecha_suscripcion">Fecha de suscripción</Label>
          <Input
            id="fecha_suscripcion"
            value={formData.fecha_suscripcion}
            onChange={(e) => handleChange('fecha_suscripcion', e.target.value)}
            type="date"
          />
        </div>

        {/* Fecha de renovación */}
        <div>
          <Label htmlFor="fecha_renovacion">Fecha de renovación</Label>
          <Input
            id="fecha_renovacion"
            value={formData.fecha_renovacion}
            onChange={(e) => handleChange('fecha_renovacion', e.target.value)}
            type="date"
          />
        </div>

        {/* Características */}
        <div className="md:col-span-2">
          <Label>Características</Label>
          <div className="flex gap-2 mt-2">
            <Input
              value={nuevaCaracteristica}
              onChange={(e) => setNuevaCaracteristica(e.target.value)}
              placeholder="Nueva característica"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), agregarCaracteristica())}
            />
            <Button type="button" onClick={agregarCaracteristica}>Agregar</Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.caracteristicas.map((caracteristica, index) => (
              <Badge key={index} variant="secondary" className="gap-1">
                {caracteristica}
                <button 
                  type="button" 
                  onClick={() => removerCaracteristica(index)}
                  className="hover:bg-destructive/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Limitaciones */}
        <div className="md:col-span-2">
          <Label>Limitaciones</Label>
          <div className="flex gap-2 mt-2">
            <Input
              value={nuevaLimitacion}
              onChange={(e) => setNuevaLimitacion(e.target.value)}
              placeholder="Nueva limitación"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), agregarLimitacion())}
            />
            <Button type="button" onClick={agregarLimitacion}>Agregar</Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.limitaciones.map((limitacion, index) => (
              <Badge key={index} variant="destructive" className="gap-1">
                {limitacion}
                <button 
                  type="button" 
                  onClick={() => removerLimitacion(index)}
                  className="hover:bg-destructive/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Casos de uso */}
        <div className="md:col-span-2">
          <Label>Casos de uso</Label>
          <div className="flex gap-2 mt-2">
            <Input
              value={nuevoCasoUso}
              onChange={(e) => setNuevoCasoUso(e.target.value)}
              placeholder="Nuevo caso de uso"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), agregarCasoUso())}
            />
            <Button type="button" onClick={agregarCasoUso}>Agregar</Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.casos_uso.map((caso, index) => (
              <Badge key={index} variant="outline" className="gap-1">
                {caso}
                <button 
                  type="button" 
                  onClick={() => removerCasoUso(index)}
                  className="hover:bg-destructive/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div>
          <Label htmlFor="rating">Rating (1-5)</Label>
          <Input
            id="rating"
            value={formData.rating}
            onChange={(e) => handleChange('rating', e.target.value)}
            placeholder="4.5"
            type="number"
            min="1"
            max="5"
            step="0.1"
          />
        </div>

        {/* Tiene API */}
        <div className="flex items-center space-x-2 pt-6">
          <Checkbox
            id="tiene_api"
            checked={formData.tiene_api}
            onCheckedChange={(checked) => handleChange('tiene_api', checked)}
          />
          <Label htmlFor="tiene_api">Tiene API</Label>
        </div>

        {/* URL API */}
        {formData.tiene_api && (
          <div className="md:col-span-2">
            <Label htmlFor="url_api">URL de la API</Label>
            <Input
              id="url_api"
              value={formData.url_api}
              onChange={(e) => handleChange('url_api', e.target.value)}
              placeholder="https://api.ejemplo.com"
              type="url"
            />
          </div>
        )}

        {/* Favorita */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="favorita"
            checked={formData.favorita}
            onCheckedChange={(checked) => handleChange('favorita', checked)}
          />
          <Label htmlFor="favorita">Favorita</Label>
        </div>

        {/* Activa */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="activa"
            checked={formData.activa}
            onCheckedChange={(checked) => handleChange('activa', checked)}
          />
          <Label htmlFor="activa">Activa</Label>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading || categorias.length === 0}>
          {isLoading ? 'Guardando...' : (initialData ? 'Actualizar' : 'Crear')}
        </Button>
      </div>
    </form>
  );
}