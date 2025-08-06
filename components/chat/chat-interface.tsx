"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { supabase, Message } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface ChatInterfaceProps {
  peerId: string
}

export function ChatInterface({ peerId }: ChatInterfaceProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [content, setContent] = useState("")

  useEffect(() => {
    if (user && peerId) {
      fetchMessages()
    }
  }, [user, peerId])

  const fetchMessages = async () => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${user!.id},receiver_id.eq.${peerId}),and(sender_id.eq.${peerId},receiver_id.eq.${user!.id})`
      )
      .order("created_at", { ascending: true })
    setMessages((data as Message[]) || [])
  }

  const sendMessage = async () => {
    if (!content.trim() || !user) return
    await supabase.from("messages").insert({
      sender_id: user.id,
      receiver_id: peerId,
      content,
    })
    setContent("")
    fetchMessages()
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-2 overflow-y-auto mb-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.sender_id === user?.id ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`rounded-lg px-3 py-2 text-sm ${
                m.sender_id === user?.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message"
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  )
}

