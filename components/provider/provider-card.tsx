import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProviderProfile } from "@/lib/supabase"

interface ProviderCardProps {
  provider: ProviderProfile
}

export function ProviderCard({ provider }: ProviderCardProps) {
  const user = (provider as any).users
  const initials = user?.full_name
    ? user.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
    : ""

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage src={user?.avatar_url || "/placeholder.svg"} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{user?.full_name}</CardTitle>
          {provider.credentials && (
            <p className="text-sm text-muted-foreground">{provider.credentials}</p>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {provider.bio && <p className="text-sm">{provider.bio}</p>}
        <div className="flex flex-wrap gap-2">
          {provider.specialties?.map((spec) => (
            <Badge key={spec}>{spec}</Badge>
          ))}
        </div>
        {provider.location && (
          <p className="text-sm text-muted-foreground">Location: {provider.location}</p>
        )}
        {provider.rating && (
          <p className="text-sm text-muted-foreground">Rating: {provider.rating}</p>
        )}
        <Button className="w-full" size="sm">View Profile</Button>
      </CardContent>
    </Card>
  )
}
