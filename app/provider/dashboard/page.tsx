"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Calendar,
  CheckCircle2,
  Dumbbell,
  Users,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase"

interface PatientRow {
  id: string
  program_name: string
  user_id: string
  users: {
    full_name: string
    avatar_url: string | null
  }
}

export default function ProviderDashboard() {
  const { user } = useAuth()
  const [patients, setPatients] = useState<PatientRow[]>([])
  const [stats, setStats] = useState({
    totalPatients: 0,
    completedSessions: 0,
    exerciseCount: 0,
  })

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    const { data: patientsData } = await supabase
      .from("patients")
      .select("id, program_name, user_id, users(full_name, avatar_url)")
      .eq("provider_id", user!.id)

    const patientList = (patientsData as any as PatientRow[]) || []
    setPatients(patientList)

    const patientIds = patientList.map((p) => p.id)

    const { count: sessionCount } = await supabase
      .from("exercise_sessions")
      .select("id", { count: "exact", head: true })
      .in("patient_id", patientIds.length ? patientIds : ["00000000-0000-0000-0000-000000000000"])

    const { count: exerciseCount } = await supabase
      .from("exercises")
      .select("id", { count: "exact", head: true })

    setStats({
      totalPatients: patientList.length,
      completedSessions: sessionCount || 0,
      exerciseCount: exerciseCount || 0,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="h-4 w-4" />
            <span>Today</span>
          </Button>
          <Button size="sm" className="gap-2">
            <Dumbbell className="h-4 w-4" />
            <span>New Program</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPatients}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed Sessions</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedSessions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Exercise Library</CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.exerciseCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patient Progress</CardTitle>
          <CardDescription>Recent patient activity and progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {patients.map((patient) => (
              <div key={patient.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={patient.users.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback>
                        {patient.users.full_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">
                        {patient.users.full_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Program: {patient.program_name}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">
                    View
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={0} className="h-2" />
                  <span className="text-xs font-medium">0%</span>
                </div>
              </div>
            ))}
            {patients.length === 0 && (
              <p className="text-sm text-muted-foreground">No patients yet.</p>
            )}
          </div>
          <div className="mt-4 flex justify-center">
            <Link href="/provider/patients">
              <Button variant="outline" size="sm">
                View All Patients
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
