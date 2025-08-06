import { ChatInterface } from "@/components/chat/chat-interface"

export default function ProviderChatPage({ params }: { params: { patientId: string } }) {
  return (
    <div className="h-full">
      <ChatInterface peerId={params.patientId} />
    </div>
  )
}

