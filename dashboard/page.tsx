'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [clientes, setClientes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    checkUser()
    cargarClientes()
  }, [])
  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) router.push('/')
    else setUser(user)
  }
  const cargarClientes = async () => {
    const { data } = await supabase.from('clientes').select('*')
    setClientes(data || [])
    setLoading(false)
  }
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }
  if (loading) return <div className="p-8">Cargando...</div>
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between">
          <h1 className="text-2xl font-bold">REDIMACOL</h1>
          <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">
            Salir
          </button>
        </div>
      </header>
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-gray-500">Clientes</h3>
            <p className="text-3xl font-bold text-blue-600">{clientes.length}</p>
          </div>
        </div>
        <div className="bg-white rounded shadow">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold">Clientes</h2>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">Nombre</th>
                <th className="p-3 text-left">DNI</th>
                <th className="p-3 text-left">Teléfono</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((c) => (
                <tr key={c.id} className="border-b">
                  <td className="p-3">{c.nombre}</td>
                  <td className="p-3">{c.dni}</td>
                  <td className="p-3">{c.telefono}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
