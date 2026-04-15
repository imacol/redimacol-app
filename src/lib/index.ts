export interface Cliente {
  id: string
  nombre: string
  dni: string
  telefono: string
  direccion: string
  sector: string
  estado: 'activo' | 'inactivo' | 'riesgo' | 'perdido'
  fecha_registro: string
  ultimo_credito?: string
  dias_ultimo_credito?: number
}

export interface Credito {
  id: string
  cliente_id: string
  cliente_nombre?: string
  monto: number
  tasa: number
  cuotas: number
  monto_cuota: number
  total_pagar: number
  fecha_inicio: string
  fecha_vencimiento: string
  estado: 'activo' | 'pagado' | 'atrasado' | 'cancelado'
  cobrador_id?: string
  cobrador_nombre?: string
  dias_atraso?: number
}

export interface Pago {
  id: string
  credito_id: string
  cliente_id: string
  monto: number
  fecha: string
  metodo: 'yape' | 'plin' | 'efectivo' | 'transferencia'
  comprobante?: string
  cobrador_id: string
}

export interface DashboardMetrics {
  totalClientes: number
  totalCreditosActivos: number
  totalCobranzaHoy: number
  clientesAtraso: number
  clientesPerdidos: number
  capitalPrestado: number
}