// ============================================================
// UTILITY FUNCTIONS
// Funciones helper comunes
// ============================================================

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina clases de Tailwind CSS de forma inteligente
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Formatear moneda
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
    // Solo formatear en el cliente para evitar problemas de hidratación
    if (typeof window !== 'undefined') {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency,
        }).format(amount);
    }
    // Formato básico en el servidor
    return `${amount} ${currency}`;
}

/**
 * Formatear porcentaje
 */
export function formatPercentage(value: number, decimals: number = 1): string {
    return `${value.toFixed(decimals)}%`;
}

/**
 * Formatear fecha
 */
export function formatDate(date: Date | string, format: 'short' | 'long' | 'relative' = 'short'): string {
    const d = typeof date === 'string' ? new Date(date) : date;

    if (format === 'relative') {
        return formatRelativeDate(d);
    }

    // Solo formatear con Intl.DateTimeFormat en el cliente para evitar problemas de hidratación
    if (typeof window !== 'undefined') {
        if (format === 'long') {
            return new Intl.DateTimeFormat('es-MX', {
                dateStyle: 'full',
            }).format(d);
        }

        return new Intl.DateTimeFormat('es-MX', {
            dateStyle: 'medium',
        }).format(d);
    }
    
    // Formato básico en el servidor
    return d.toISOString();
}

/**
 * Formatear fecha relativa (hace 2 días, en 3 horas, etc.)
 */
export function formatRelativeDate(date: Date): string {
    const now = new Date();
    const diffInMs = date.getTime() - now.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        if (diffInHours === 0) {
            const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
            if (diffInMinutes === 0) return 'Ahora';
            if (diffInMinutes > 0) return `En ${diffInMinutes} min`;
            return `Hace ${Math.abs(diffInMinutes)} min`;
        }
        if (diffInHours > 0) return `En ${diffInHours}h`;
        return `Hace ${Math.abs(diffInHours)}h`;
    }

    if (diffInDays > 0) {
        if (diffInDays === 1) return 'Mañana';
        if (diffInDays < 7) return `En ${diffInDays} días`;
        return formatDate(date, 'short');
    }

    if (diffInDays === -1) return 'Ayer';
    if (diffInDays > -7) return `Hace ${Math.abs(diffInDays)} días`;

    return formatDate(date, 'short');
}

/**
 * Formatear tamaño de archivo
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Truncar texto
 */
export function truncate(text: string, length: number = 100): string {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
}

/**
 * Generar color por string (para avatares, etiquetas, etc.)
 */
export function stringToColor(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue = hash % 360;
    return `hsl(${hue}, 70%, 50%)`;
}

/**
 * Generar iniciales de nombre
 */
export function getInitials(name: string): string {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
}

/**
 * Calcular días entre dos fechas
 */
export function daysBetween(date1: Date, date2: Date): number {
    const diffInMs = Math.abs(date2.getTime() - date1.getTime());
    return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
}

/**
 * Validar si una fecha está vencida
 */
export function isOverdue(date: Date): boolean {
    return date < new Date();
}

/**
 * Sleep/delay helper
 */
export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null;
            func(...args);
        };

        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Generar ID único
 */
export function generateId(): string {
    // Para evitar problemas de hidratación, solo generar IDs en el cliente
    if (typeof window !== 'undefined') {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    // En el servidor, devolver un placeholder
    return 'temp-id';
}

/**
 * Validar email
 */
export function isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Capitalizar primera letra
 */
export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Pluralizar palabra (español básico)
 */
export function pluralize(word: string, count: number): string {
    if (count === 1) return word;

    // Reglas básicas de pluralización en español
    if (word.endsWith('z')) return word.slice(0, -1) + 'ces';
    if (word.endsWith('ión')) return word.slice(0, -2) + 'iones';
    if (word.match(/[aeiou]$/)) return word + 's';
    return word + 'es';
}

/**
 * Copiar al portapapeles
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    // Solo ejecutar en el cliente
    if (typeof window === 'undefined' || !navigator.clipboard) {
        console.warn('Clipboard API not available');
        return false;
    }
    
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Error al copiar:', err);
        return false;
    }
}

/**
 * Descargar archivo
 */
export function downloadFile(url: string, filename: string): void {
    // Solo ejecutar en el cliente para evitar problemas de hidratación
    if (typeof window !== 'undefined') {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        console.warn('downloadFile solo se puede ejecutar en el cliente');
    }
}

/**
 * Obtener extensión de archivo
 */
export function getFileExtension(filename: string): string {
    return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
}

/**
 * Verificar si es imagen
 */
export function isImageFile(filename: string): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
    const ext = getFileExtension(filename).toLowerCase();
    return imageExtensions.includes(ext);
}

/**
 * Verificar si es video
 */
export function isVideoFile(filename: string): boolean {
    const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'];
    const ext = getFileExtension(filename).toLowerCase();
    return videoExtensions.includes(ext);
}