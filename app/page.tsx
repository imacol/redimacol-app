'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Users, DollarSign, AlertTriangle, Phone } from 'lucide-react'

export default function DashboardAdmin() {
  const [metrics, setMetrics] = useState({
    totalClientes: 0,
    totalCreditosActivos: 0,
    clientesAtraso: 0,
    capitalPrestado: 0,
  })
  const [clientesAtraso, setClientesAtraso] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const { data: resumen } = await supabase
        .from('resumen_ejecutivo_admin')
        .select('*')
        .single()

      const { data: atraso } = await supabase
        .from('vista_clientes_atraso')
        .select('*')
        .limit(10)

      setMetrics({
        totalClientes: resumen?.total_clientes || 0,
