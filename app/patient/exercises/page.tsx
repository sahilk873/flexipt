"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Filter, Play, Clock, Target } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase"
import { Exercise } from "@/lib/supabase"

export default function PatientExercisesPage() {
  const { user } = useAuth()
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterDifficulty, setFilterDifficulty] = useState("all")

  useEffect(() => {
    if (user) {
      fetchPatientExercises()
    }
  }, [user])

  const fetchPatientExercises = async () => {
    try {
      // First get the patient record
      const { data: patientData, error: patientError } = await supabase
        .from('patients')
        .select('id')
        .eq('user_id', user?.id)
        .single()

      if (patientError) {
        console.error('Error fetching patient:', patientError)
        return
      }

      // Get assigned exercises for this patient
      const { data: assignedExercises, error: assignedError } = await supabase
        .from('patient_exercises')
        .select(`
          exercise_id,
          exercises (
            id,
            name,
            description,
            category,
            body_region,
            difficulty,
            thumbnail_url,
            instructions,
            sets,
            reps,
            duration
          )
        `)
        .eq('patient_id', patientData.id)
        .eq('is_active', true)

      if (assignedError) {
        console.error('Error fetching assigned exercises:', assignedError)
        return
      }

      // Extract exercises from the joined data
      const exerciseList = assignedExercises?.map(item => item.exercises).filter(Boolean) || []
      setExercises(exerciseList)
    } catch (error) {
      console.error('Error fetching exercises:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || exercise.category === filterCategory
    const matchesDifficulty = filterDifficulty === "all" || exercise.difficulty === filterDifficulty
    
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Exercises</h1>
            <p className="text-muted-foreground">
              Your assigned exercise program
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Exercises</h1>
          <p className="text-muted-foreground">
            Your assigned exercise program
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Strength">Strength</SelectItem>
            <SelectItem value="Mobility">Mobility</SelectItem>
            <SelectItem value="Balance">Balance</SelectItem>
            <SelectItem value="Cardio">Cardio</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Difficulties</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Exercise Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredExercises.map((exercise) => (
          <Card key={exercise.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{exercise.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {exercise.description}
                  </CardDescription>
                </div>
                <Badge className={getDifficultyColor(exercise.difficulty)}>
                  {exercise.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video bg-muted rounded-md overflow-hidden">
                <img
                  src={exercise.thumbnail_url || "/placeholder.svg"}
                  alt={exercise.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Body Region</span>
                  <span className="font-medium">{exercise.body_region}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Sets × Reps</span>
                  <span className="font-medium">{exercise.sets} × {exercise.reps}</span>
                </div>
                {exercise.duration && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">{exercise.duration}s</span>
                  </div>
                )}
              </div>

              <div className="pt-4">
                <Link href={`/patient/exercises/session?exerciseId=${exercise.id}`}>
                  <Button className="w-full" size="sm">
                    <Play className="mr-2 h-4 w-4" />
                    Start Exercise
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredExercises.length === 0 && !loading && (
        <div className="text-center py-12">
          <Target className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No exercises found</h3>
          <p className="text-muted-foreground">
            {exercises.length === 0 
              ? "You don't have any exercises assigned yet. Contact your provider."
              : "Try adjusting your search or filters."
            }
          </p>
        </div>
      )}
    </div>
  )
} 