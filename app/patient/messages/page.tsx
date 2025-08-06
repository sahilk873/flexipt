"use client"

import { useEffect, useState } from "react"
import { ChatInterface } from "@/components/chat/chat-interface"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase"

export default function PatientMessagesPage() {
  const { user } = useAuth()
  const [providerId, setProviderId] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchProvider()
    }
  }, [user])

  const fetchProvider = async () => {
    const { data } = await supabase
      .from('patients')
      .select('provider_id')
      .eq('user_id', user!.id)
      .single()
    setProviderId(data?.provider_id || null)
  }

  if (!providerId) {
    return <div>No provider assigned.</div>
  }

  return (
    <div className="h-full">
      <ChatInterface peerId={providerId} />
    </div>
  )
}

