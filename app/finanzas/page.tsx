import { FinanzaService } from '@/lib/services/finanza.service';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Plus, ArrowUpRight, ArrowDownLeft, DollarSign } from 'lucide-react';

export default async function FinanzasPage() {
    const { transacciones } = await FinanzaService.list({ page: 1, limit: 50 });
    const resumen = await FinanzaService.obtenerResumenGlobal();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Finanzas</h1>
                    <p className="text-muted-foreground">Control de ingresos, gastos y presupuesto de proyectos.</p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nueva Transacción
                </Button>
            </div>

            {/* Resumen Global Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="text-sm font-medium">Presupuesto Total</div>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">${resumen.presupuesto_total.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Asignado a proyectos activos</p>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="text-sm font-medium">Ingresos Totales</div>
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="text-2xl font-bold text-green-600">${resumen.ingresos_totales.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">+20.1% del mes pasado</p>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="text-sm font-medium">Gastos Totales</div>
                        <ArrowDownLeft className="h-4 w-4 text-red-500" />
                    </div>
                    <div className="text-2xl font-bold text-red-600">${resumen.gastos_totales.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Acumulado anual</p>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="text-sm font-medium">ROI Promedio</div>
                        <div className="h-4 w-4 text-muted-foreground">%</div>
                    </div>
                    <div className="text-2xl font-bold">{resumen.roi_promedio.toFixed(1)}%</div>
                    <p className="text-xs text-muted-foreground">Retorno de inversión</p>
                </div>
            </div>

            <div className="rounded-md border bg-card">
                <div className="p-4 border-b">
                    <h3 className="font-semibold">Transacciones Recientes</h3>
                </div>
                {transacciones.length === 0 ? (
                    <div className="py-10 text-center text-muted-foreground">
                        No hay transacciones registradas.
                    </div>
                ) : (
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Fecha</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Concepto</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Proyecto</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Categoría</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Estado</th>
                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Monto</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {transacciones.map((t: any) => (
                                    <tr key={t.id} className="border-b transition-colors hover:bg-muted/50">
                                        <td className="p-4 align-middle">
                                            {t.
                                                fecha_transaccion ? new Date(t.fecha_transaccion).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="p-4 align-middle font-medium">{t.concepto}</td>
                                        <td className="p-4 align-middle text-muted-foreground">{t.proyecto?.nombre || '-'}</td>
                                        <td className="p-4 align-middle capitalize">{t.categoria?.toLowerCase().replace('_', ' ')}</td>
                                        <td className="p-4 align-middle">
                                            <Badge variant={t.estado === 'PAGADO' ? 'success' : t.estado === 'PENDIENTE' ? 'warning' : 'outline'}>
                                                {t.estado}
                                            </Badge>
                                        </td>
                                        <td className={`p-4 align-middle text-right font-medium ${t.tipo_transaccion === 'INGRESO' ? 'text-green-600' : ''}`}>
                                            {t.tipo_transaccion === 'GASTO' ? '-' : '+'}${Number(t.monto).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
