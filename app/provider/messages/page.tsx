"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase"

interface PatientRow {
  id: string
  user_id: string
  users: { full_name: string }
}

export default function ProviderMessagesPage() {
  const { user } = useAuth()
  const [patients, setPatients] = useState<PatientRow[]>([])

  useEffect(() => {
    if (user) {
      fetchPatients()
    }
  }, [user])

  const fetchPatients = async () => {
    const { data } = await supabase
      .from('patients')
      .select('id, user_id, users(full_name)')
      .eq('provider_id', user!.id)
    setPatients((data as any) || [])
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
      <ul className="space-y-2">
        {patients.map((p) => (
          <li key={p.id}>
            <Link className="text-primary underline" href={`/provider/messages/${p.user_id}`}>
              {p.users.full_name}
            </Link>
          </li>
        ))}
        {patients.length === 0 && (
          <p className="text-sm text-muted-foreground">No patients.</p>
        )}
      </ul>
    </div>
  )
}

