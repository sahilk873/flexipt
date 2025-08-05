"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { ProviderCard } from "@/components/provider/provider-card"
import { ProviderProfile, supabase } from "@/lib/supabase"

export default function ProviderSearchPage() {
  const [providers, setProviders] = useState<ProviderProfile[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    const fetchProviders = async () => {
      const { data, error } = await supabase
        .from("provider_profiles")
        .select("*, users(full_name, avatar_url)")

      if (!error && data) {
        setProviders(data as any)
      }
    }
    fetchProviders()
  }, [])

  const filtered = providers.filter((p) => {
    const name = (p as any).users?.full_name || ""
    const specialties = p.specialties?.join(" ") || ""
    const location = p.location || ""
    const term = search.toLowerCase()
    return (
      name.toLowerCase().includes(term) ||
      specialties.toLowerCase().includes(term) ||
      location.toLowerCase().includes(term)
    )
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Find Providers</h1>
      <Input
        placeholder="Search by name, specialty, or location"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((provider) => (
          <ProviderCard key={provider.id} provider={provider} />
        ))}
      </div>
    </div>
  )
}
