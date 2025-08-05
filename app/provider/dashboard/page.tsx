import Link from "next/link"
import { Activity, Calendar, CheckCircle2, Clock, Dumbbell, Users, XCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function ProviderDashboard() {
  // Mock data
  const stats = [
    {
      title: "Total Patients",
      value: "42",
      icon: Users,
      change: "+3 this week",
      trend: "up",
    },
    {
      title: "Completed Sessions",
      value: "128",
      icon: CheckCircle2,
      change: "+24 this week",
      trend: "up",
    },
    {
      title: "Missed Sessions",
      value: "7",
      icon: XCircle,
      change: "-2 this week",
      trend: "down",
    },
    {
      title: "Exercise Library",
      value: "156",
      icon: Dumbbell,
      change: "+5 this week",
      trend: "up",
    },
  ]

  const upcomingSessions = [
    {
      patient: "Michael Smith",
      time: "10:00 AM",
      program: "Knee Rehabilitation",
      avatar: "",
    },
    {
      patient: "Emma Johnson",
      time: "11:30 AM",
      program: "Shoulder Mobility",
      avatar: "",
    },
    {
      patient: "David Wilson",
      time: "2:15 PM",
      program: "Lower Back Strength",
      avatar: "",
    },
  ]

  const recentPatients = [
    {
      name: "Michael Smith",
      program: "Knee Rehabilitation",
      progress: 75,
      lastSession: "Today",
      avatar: "",
    },
    {
      name: "Emma Johnson",
      program: "Shoulder Mobility",
      progress: 60,
      lastSession: "Yesterday",
      avatar: "",
    },
    {
      name: "David Wilson",
      program: "Lower Back Strength",
      progress: 40,
      lastSession: "2 days ago",
      avatar: "",
    },
    {
      name: "Sophia Brown",
      program: "Ankle Stability",
      progress: 90,
      lastSession: "3 days ago",
      avatar: "",
    },
  ]

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
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Today's Sessions</CardTitle>
            <CardDescription>
              You have {upcomingSessions.length} sessions scheduled for today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <div
                  key={session.patient}
                  className="flex items-center justify-between space-x-4"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={session.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {session.patient
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">
                        {session.patient}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {session.program}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{session.time}</span>
                    </Badge>
                    <Button size="sm" variant="ghost">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-center">
              <Link href="/provider/calendar">
                <Button variant="outline" size="sm">
                  View Full Schedule
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Patient Progress</CardTitle>
            <CardDescription>
              Recent patient activity and progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPatients.map((patient) => (
                <div key={patient.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={patient.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {patient.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium leading-none">
                          {patient.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Last session: {patient.lastSession}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      View
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={patient.progress} className="h-2" />
                    <span className="text-xs font-medium">{patient.progress}%</span>
                  </div>
                </div>
              ))}
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
    </div>
  )
}
