"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { ProviderCard } from "@/components/provider/provider-card"
import { ProviderProfile, supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/use-auth"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle } from "lucide-react"

export default function ProviderSearchPage() {
  const [providers, setProviders] = useState<ProviderProfile[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchProviders = async () => {
      setLoading(true)
      setError(null)
      
      try {
        console.log(' Fetching providers...')
        const { data, error } = await supabase
          .from("provider_profiles")
          .select("*, users(full_name, avatar_url)")

        if (error) {
          console.error('❌ Error fetching providers:', error)
          setError(`Failed to load providers: ${error.message}`)
        } else {
          console.log('✅ Providers fetched successfully:', data?.length || 0, 'providers')
          if (data && data.length > 0) {
            console.log('Sample provider:', data[0])
          }
          setProviders(data as any)
        }
      } catch (err) {
        console.error('❌ Unexpected error:', err)
        setError('An unexpected error occurred while loading providers')
      } finally {
        setLoading(false)
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

  async function handleConnect(provider: ProviderProfile) {
    if (!user) return
    
    try {
      const { data: existing } = await supabase
        .from('patients')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()

      if (existing) {
        await supabase.from('patients').update({ provider_id: provider.user_id }).eq('id', existing.id)
      } else {
        await supabase.from('patients').insert({
          user_id: user.id,
          provider_id: provider.user_id,
          diagnosis: 'TBD',
          program_name: 'General',
          start_date: new Date().toISOString(),
          status: 'active'
        })
      }
      alert('Provider connected successfully!')
    } catch (err) {
      console.error('Error connecting to provider:', err)
      alert('Failed to connect to provider. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Find Providers</h1>
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading providers...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Find Providers</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Find Providers</h1>
      
      {providers.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No providers found. This could be because:
            <ul className="mt-2 list-disc list-inside">
              <li>No healthcare providers have signed up yet</li>
              <li>There might be an issue with the database connection</li>
              <li>The RLS policies might need to be updated</li>
            </ul>
            <p className="mt-2">
              Try signing up as a provider first to test the functionality.
            </p>
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <Input
            placeholder="Search by name, specialty, or location"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} onConnect={handleConnect} />
            ))}
          </div>
          {filtered.length === 0 && search && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No providers match your search criteria. Try a different search term.
              </AlertDescription>
            </Alert>
          )}
        </>
      )}
    </div>
  )
}
