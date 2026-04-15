'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseClient } from '@/lib/supabase'
import { Users, DollarSign, AlertTriangle, Phone } from 'lucide-react'

export default function DashboardAdmin() {
  const [metrics, setMetrics] = useState({
    totalClientes: 0,
    totalCreditosActivos: 0,
    clientesAtraso: 0,
    capitalPrestado: 0,
  })
  const [clientesAtraso, setClientesAtraso] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const { data: resumen } = await supabaseClient
        .from('resumen_ejecutivo_admin')
        .select('*')
        .single()

      const { data: atraso } = await supabaseClient
        .from('vista_clientes_atraso')
        .select('*')
        .limit(10)

      setMetrics({
        totalClientes: resumen?.total_clientes || 0,
        totalCreditosActivos: resumen?.creditos_activos || 0,
        clientesAtraso: resumen?.clientes_atraso || 0,
        capitalPrestado: resumen?.capital_prestado || 0,
      })

      setClientesAtraso(atraso || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const generarWhatsAppLink = (telefono: string, mensaje: string) => {
    const numero = telefono.replace(/\D/g, '')
    return `https://wa.me/51${numero}?text=${encodeURIComponent(mensaje)}`
  }

  if (loading) return <div className="p-8">Cargando...</div>

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-red-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">RED IMACOL - Admin</h1>
          <button 
            onClick={() => router.push('/creditos/nuevo')}
            className="bg-red-700 px-4 py-2 rounded-lg hover:bg-red-800"
          >
            + Nuevo Crédito
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clientes</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.totalClientes}</p>
              </div>
              <Users className="text-blue-500" size={32} />
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Créditos Activos</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.totalCreditosActivos}</p>
              </div>
              <DollarSign className="text-green-500" size={32} />
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clientes en Atraso</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.clientesAtraso}</p>
              </div>
              <AlertTriangle className="text-yellow-500" size={32} />
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Capital Prestado</p>
                <p className="text-2xl font-bold text-gray-900">S/ {metrics.capitalPrestado}</p>
              </div>
              <DollarSign className="text-purple-500" size={32} />
            </div>
          </div>
        </div>

        {/* Clientes en Atraso */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-red-600 flex items-center gap-2">
              <AlertTriangle size={20} />
              Clientes en Atraso
            </h2>
          </div>
          <div className="p-4">
            {clientesAtraso.length === 0 ? (
              <p className="text-gray-500">No hay clientes en atraso 🎉</p>
            ) : (
              <div className="space-y-3">
                {clientesAtraso.map((cliente: any) => (
                  <div key={cliente.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{cliente.nombre}</p>
                      <p className="text-sm text-gray-500">
                        {cliente.dias_atraso} días de atraso - Cuota: S/ {cliente.monto_cuota}
                      </p>
                    </div>
                    <a
                      href={generarWhatsAppLink(cliente.telefono, 
                        `Hola ${cliente.nombre}, te escribe REDIMACOL. Tu cuota vence hoy. ¿Deseas pagar?`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600"
                    >
                      <Phone size={16} />
                      WhatsApp
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}