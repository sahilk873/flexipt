"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Activity, Calendar, CheckCircle2, Clock, Dumbbell, Flame, Medal, Trophy } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase"
import { Exercise, ExerciseSession, Progress as ProgressType } from "@/lib/supabase"

export default function PatientDashboard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    completedSessions: 0,
    currentStreak: 0,
    formScore: 0,
    nextSession: null as string | null,
  })
  const [upcomingExercises, setUpcomingExercises] = useState<Exercise[]>([])
  const [recentAchievements, setRecentAchievements] = useState<any[]>([])
  const [progress, setProgress] = useState<ProgressType[]>([])

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      // Get patient record
      const { data: patientData, error: patientError } = await supabase
        .from('patients')
        .select('id, program_name')
        .eq('user_id', user?.id)
        .single()

      if (patientError) {
        console.error('Error fetching patient:', patientError)
        return
      }

      // Fetch completed sessions count
      const { count: sessionsCount } = await supabase
        .from('exercise_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('patient_id', patientData.id)

      // Fetch recent sessions for form score
      const { data: recentSessions } = await supabase
        .from('exercise_sessions')
        .select('form_score')
        .eq('patient_id', patientData.id)
        .order('completed_at', { ascending: false })
        .limit(10)

      const avgFormScore = recentSessions?.length 
        ? Math.round(recentSessions.reduce((sum, session) => sum + (session.form_score || 0), 0) / recentSessions.length)
        : 0

      // Fetch assigned exercises with custom sets/reps
      const { data: assignedExercises } = await supabase
        .from('patient_exercises')
        .select(`
          sets,
          reps,
          exercises (
            id,
            name,
            thumbnail_url,
            sets,
            reps
          )
        `)
        .eq('patient_id', patientData.id)
        .eq('is_active', true)
        .limit(3)

      const exercises =
        (assignedExercises?.map((item: any) => ({
          ...(item.exercises || {}),
          sets: item.sets ?? item.exercises?.sets,
          reps: item.reps ?? item.exercises?.reps,
        })) || []) as Exercise[]

      // Fetch progress data
      const { data: progressData } = await supabase
        .from('progress')
        .select('*')
        .eq('patient_id', patientData.id)
        .order('recorded_at', { ascending: false })

      // Calculate streak (mock for now)
      const currentStreak = 5 // This would be calculated from session dates

      setStats({
        completedSessions: sessionsCount || 0,
        currentStreak,
        formScore: avgFormScore,
        nextSession: null,
      })
      setUpcomingExercises(exercises)
      setProgress(progressData || [])

      // Mock achievements for now
      setRecentAchievements([
        {
          title: "Perfect Form",
          description: `Achieved ${avgFormScore}% form score on recent exercises`,
          icon: Trophy,
          date: "Yesterday",
        },
        {
          title: "Consistency Champion",
          description: `Completed ${currentStreak} days in a row`,
          icon: Flame,
          date: "Today",
        },
        {
          title: "Range Master",
          description: "Improved range of motion significantly",
          icon: Medal,
          date: "3 days ago",
        },
      ])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const statsData = [
    {
      title: "Completed Sessions",
      value: stats.completedSessions.toString(),
      icon: CheckCircle2,
      change: "+3 this week",
    },
    {
      title: "Current Streak",
      value: `${stats.currentStreak} days`,
      icon: Flame,
      change: "Keep it up!",
    },
    {
      title: "Form Score",
      value: `${stats.formScore}%`,
      icon: Medal,
      change: "+2% improvement",
    },
    {
      title: "Next Session",
      value: stats.nextSession || "Today",
      icon: Calendar,
      change: "10:00 AM",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.user_metadata?.full_name || 'Patient'}</h1>
          <p className="text-muted-foreground">
            Your rehabilitation program is in progress
          </p>
        </div>
        <Button size="sm" className="gap-2">
          <Dumbbell className="h-4 w-4" />
          <span>Start Today's Session</span>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Today's Exercises</CardTitle>
            <CardDescription>
              You have {upcomingExercises.length} exercises scheduled for today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingExercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="flex items-center space-x-4"
                >
                  <div className="h-20 w-32 overflow-hidden rounded-md bg-muted">
                    <img
                      src={exercise.thumbnail_url || "/placeholder.svg"}
                      alt={exercise.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{exercise.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {exercise.sets} sets × {exercise.reps} reps
                    </p>
                  </div>
                  <Link href={`/patient/exercises/session?exerciseId=${exercise.id}`}>
                    <Button size="sm">Start</Button>
                  </Link>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-center">
              <Link href="/patient/exercises">
                <Button variant="outline" size="sm">
                  View All Exercises
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
            <CardDescription>
              Rehabilitation Program
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {progress.length > 0 ? (
              progress.slice(0, 4).map((metric) => (
                <div key={metric.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div>{metric.metric_name}</div>
                    <div className="font-medium">{metric.current_value}/{metric.target_value} {metric.unit}</div>
                  </div>
                  <Progress 
                    value={(metric.current_value / metric.target_value) * 100} 
                    className="h-2" 
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="mx-auto h-8 w-8 mb-2" />
                <p>No progress data available yet</p>
              </div>
            )}
            
            <div className="flex justify-center">
              <Link href="/patient/progress">
                <Button variant="outline" size="sm">
                  View Detailed Progress
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Achievements</CardTitle>
          <CardDescription>
            Your latest milestones and accomplishments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {recentAchievements.map((achievement) => (
              <div
                key={achievement.title}
                className="flex flex-col items-center rounded-lg border p-4 text-center"
              >
                <div className="mb-3 rounded-full bg-primary/10 p-2">
                  <achievement.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium">{achievement.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {achievement.description}
                </p>
                <Badge variant="outline" className="mt-3">
                  {achievement.date}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
