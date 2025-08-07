"use client"

import React, { useState } from "react"
import Link from "next/link"
import { ArrowLeft, BarChart3, Calendar, ChevronRight, Dumbbell, Edit, FileText, MessageSquare, MoreHorizontal, Plus, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function PatientProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const [activeTab, setActiveTab] = useState("overview")
  
  // Unwrap params using React.use()
  const resolvedParams = React.use(params)
  
  // Mock patient data
  const patient = {
    id: parseInt(resolvedParams.id),
    name: "Michael Smith",
    email: "michael.smith@example.com",
    phone: "(555) 123-4567",
    dateOfBirth: "1985-06-15",
    program: "Knee Rehabilitation",
    progress: 75,
    lastSession: "Today",
    status: "Active",
    avatar: "",
    diagnosis: "ACL Tear (Right Knee)",
    startDate: "2023-10-15",
    provider: "Dr. Sarah Johnson",
    notes: "Patient is responding well to therapy. Range of motion has improved significantly in the past two weeks.",
  }
  
  // Mock exercise data
  const exercises = [
    {
      name: "Knee Extension",
      sets: 3,
      reps: 12,
      lastPerformed: "Today",
      formScore: 85,
      thumbnail: "/placeholder.svg?height=60&width=80",
    },
    {
      name: "Hamstring Stretch",
      sets: 2,
      reps: 30,
      lastPerformed: "Today",
      formScore: 90,
      thumbnail: "/placeholder.svg?height=60&width=80",
    },
    {
      name: "Quad Strengthening",
      sets: 3,
      reps: 10,
      lastPerformed: "Yesterday",
      formScore: 75,
      thumbnail: "/placeholder.svg?height=60&width=80",
    },
    {
      name: "Balance Board",
      sets: 2,
      reps: 60,
      lastPerformed: "3 days ago",
      formScore: 65,
      thumbnail: "/placeholder.svg?height=60&width=80",
    },
  ]
  
  // Mock session history
  const sessionHistory = [
    {
      date: "2023-11-15",
      exercises: 4,
      duration: "25 min",
      formScore: 85,
      painLevel: 3,
    },
    {
      date: "2023-11-13",
      exercises: 4,
      duration: "28 min",
      formScore: 80,
      painLevel: 4,
    },
    {
      date: "2023-11-10",
      exercises: 3,
      duration: "20 min",
      formScore: 75,
      painLevel: 5,
    },
    {
      date: "2023-11-08",
      exercises: 4,
      duration: "30 min",
      formScore: 70,
      painLevel: 6,
    },
    {
      date: "2023-11-06",
      exercises: 3,
      duration: "22 min",
      formScore: 65,
      painLevel: 6,
    },
  ]
  
  // Mock progress metrics
  const progressMetrics = [
    {
      metric: "Range of Motion",
      current: 120,
      target: 135,
      unit: "degrees",
      progress: 89,
    },
    {
      metric: "Strength",
      current: 65,
      target: 85,
      unit: "lbs",
      progress: 76,
    },
    {
      metric: "Pain Level",
      current: 3,
      target: 0,
      unit: "/10",
      progress: 70,
    },
    {
      metric: "Balance",
      current: 25,
      target: 30,
      unit: "seconds",
      progress: 83,
    },
  ]
  
  // Mock upcoming sessions
  const upcomingSessions = [
    {
      date: "2023-11-17",
      time: "10:00 AM",
      type: "Video Session",
    },
    {
      date: "2023-11-20",
      time: "11:30 AM",
      type: "In-Person",
    },
    {
      date: "2023-11-24",
      time: "10:00 AM",
      type: "Video Session",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/provider/patients">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Patient Profile</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={patient.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-xl">
                  {patient.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <h2 className="mt-4 text-xl font-bold">{patient.name}</h2>
              <Badge className="mt-2">{patient.status}</Badge>
              
              <div className="mt-6 w-full space-y-2 text-left">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium">{patient.email}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Phone</span>
                  <span className="font-medium">{patient.phone}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Date of Birth</span>
                  <span className="font-medium">{patient.dateOfBirth}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Diagnosis</span>
                  <span className="font-medium">{patient.diagnosis}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Start Date</span>
                  <span className="font-medium">{patient.startDate}</span>
                </div>
              </div>
              
              <div className="mt-6 flex w-full flex-col gap-2">
                <Button className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Message Patient</span>
                </Button>
                <Button variant="outline" className="gap-2">
                  <Edit className="h-4 w-4" />
                  <span>Edit Profile</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Current Program</CardTitle>
                  <CardDescription>
                    {patient.program} - Started on {patient.startDate}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit Program</DropdownMenuItem>
                    <DropdownMenuItem>Add Exercise</DropdownMenuItem>
                    <DropdownMenuItem>View History</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>End Program</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Overall Progress</span>
                    <span className="font-medium">{patient.progress}%</span>
                  </div>
                  <Progress value={patient.progress} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border p-3">
                    <div className="text-sm text-muted-foreground">Last Session</div>
                    <div className="font-medium">{patient.lastSession}</div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="text-sm text-muted-foreground">Next Session</div>
                    <div className="font-medium">{upcomingSessions[0].date}</div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="text-sm text-muted-foreground">Adherence Rate</div>
                    <div className="font-medium">92%</div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="text-sm text-muted-foreground">Avg. Form Score</div>
                    <div className="font-medium">78%</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="exercises">Exercises</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4 pt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Upcoming Sessions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {upcomingSessions.map((session, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-lg border p-3"
                        >
                          <div>
                            <div className="font-medium">{session.date}</div>
                            <div className="text-sm text-muted-foreground">
                              {session.time} - {session.type}
                            </div>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Calendar className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex justify-center">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        <span>Schedule Session</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {sessionHistory.slice(0, 3).map((session, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                            <Dumbbell className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">Completed Session</div>
                            <div className="text-sm text-muted-foreground">
                              {session.date} - {session.exercises} exercises
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex justify-center">
                      <Button variant="outline" size="sm" className="gap-2">
                        <BarChart3 className="h-4 w-4" />
                        <span>View All Activity</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Key Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {progressMetrics.map((metric) => (
                      <div key={metric.metric} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>{metric.metric}</span>
                          <span className="font-medium">
                            {metric.current}{metric.unit} / {metric.target}{metric.unit}
                          </span>
                        </div>
                        <Progress value={metric.progress} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="exercises" className="pt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base">Assigned Exercises</CardTitle>
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    <span>Add Exercise</span>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {exercises.map((exercise, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-15 w-20 overflow-hidden rounded-md bg-muted">
                            <img
                              src={exercise.thumbnail || "/placeholder.svg"}
                              alt={exercise.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium">{exercise.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {exercise.sets} sets × {exercise.reps} reps
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Last performed: {exercise.lastPerformed}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">Form Score</div>
                            <div className="font-medium">{exercise.formScore}%</div>
                          </div>
                          <Button variant="ghost" size="icon">
                            <ChevronRight className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="progress" className="pt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Session History</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Exercises</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Form Score</TableHead>
                        <TableHead>Pain Level</TableHead>
                        <TableHead className="w-[80px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sessionHistory.map((session, index) => (
                        <TableRow key={index}>
                          <TableCell>{session.date}</TableCell>
                          <TableCell>{session.exercises}</TableCell>
                          <TableCell>{session.duration}</TableCell>
                          <TableCell>{session.formScore}%</TableCell>
                          <TableCell>{session.painLevel}/10</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon">
                              <ChevronRight className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notes" className="pt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base">Clinical Notes</CardTitle>
                  <Button size="sm" className="gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Add Note</span>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="font-medium">Progress Note</div>
                        <div className="text-sm text-muted-foreground">2023-11-15</div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {patient.notes}
                      </p>
                      <div className="mt-2 text-sm text-muted-foreground">
                        By: {patient.provider}
                      </div>
                    </div>
                    
                    <div className="rounded-lg border p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="font-medium">Initial Assessment</div>
                        <div className="text-sm text-muted-foreground">2023-10-15</div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Patient presents with right knee pain following sports injury. MRI confirms ACL tear. 
                        Limited range of motion and moderate swelling observed. Patient reports pain level of 7/10.
                        Recommended conservative management with physical therapy.
                      </p>
                      <div className="mt-2 text-sm text-muted-foreground">
                        By: {patient.provider}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
