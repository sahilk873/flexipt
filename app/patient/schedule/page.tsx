"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Assignment {
  id: string
  sets: number
  reps: number
  exercises: {
    name: string
    description: string
  }
}

export default function PatientSchedulePage() {
  const { user } = useAuth()
  const [assignments, setAssignments] = useState<Assignment[]>([])

  useEffect(() => {
    if (user) {
      fetchAssignments()
    }
  }, [user])

  const fetchAssignments = async () => {
    const { data: patient } = await supabase
      .from('patients')
      .select('id')
      .eq('user_id', user!.id)
      .single()

    if (!patient) return

    const { data } = await supabase
      .from('patient_exercises')
      .select('id, sets, reps, exercises(name, description)')
      .eq('patient_id', patient.id)
      .eq('is_active', true)

    setAssignments((data as any) || [])
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Schedule</h1>
      <div className="space-y-4">
        {assignments.map((a) => (
          <Card key={a.id}>
            <CardHeader>
              <CardTitle>{a.exercises.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2 text-sm text-muted-foreground">{a.exercises.description}</p>
              <p className="text-sm">Sets: {a.sets} Reps: {a.reps}</p>
            </CardContent>
          </Card>
        ))}
        {assignments.length === 0 && (
          <p className="text-sm text-muted-foreground">No exercises scheduled.</p>
        )}
      </div>
    </div>
  )
}

