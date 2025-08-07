"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpDown, ChevronDown, Filter, MoreHorizontal, Plus, Search, UserPlus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"

// Mock data for patients
const patientsData = [
  {
    id: 1,
    name: "Michael Smith",
    email: "michael.smith@example.com",
    program: "Knee Rehabilitation",
    progress: 75,
    lastSession: "Today",
    status: "Active",
    avatar: "",
  },
  {
    id: 2,
    name: "Emma Johnson",
    email: "emma.johnson@example.com",
    program: "Shoulder Mobility",
    progress: 60,
    lastSession: "Yesterday",
    status: "Active",
    avatar: "",
  },
  {
    id: 3,
    name: "David Wilson",
    email: "david.wilson@example.com",
    program: "Lower Back Strength",
    progress: 40,
    lastSession: "2 days ago",
    status: "At Risk",
    avatar: "",
  },
  {
    id: 4,
    name: "Sophia Brown",
    email: "sophia.brown@example.com",
    program: "Ankle Stability",
    progress: 90,
    lastSession: "3 days ago",
    status: "Active",
    avatar: "",
  },
  {
    id: 5,
    name: "James Taylor",
    email: "james.taylor@example.com",
    program: "Hip Mobility",
    progress: 30,
    lastSession: "1 week ago",
    status: "Inactive",
    avatar: "",
  },
  {
    id: 6,
    name: "Olivia Davis",
    email: "olivia.davis@example.com",
    program: "Wrist Rehabilitation",
    progress: 85,
    lastSession: "Today",
    status: "Active",
    avatar: "",
  },
  {
    id: 7,
    name: "William Martinez",
    email: "william.martinez@example.com",
    program: "Neck Pain Relief",
    progress: 50,
    lastSession: "4 days ago",
    status: "Active",
    avatar: "",
  },
  {
    id: 8,
    name: "Ava Anderson",
    email: "ava.anderson@example.com",
    program: "Post-Surgery Knee",
    progress: 15,
    lastSession: "2 weeks ago",
    status: "At Risk",
    avatar: "",
  },
]

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  program: z.string().min(1, { message: "Please select a program" }),
})

export default function PatientsPage() {
  const [patients, setPatients] = useState(patientsData)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      program: "",
    },
  })

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         patient.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(patient.status)
    const matchesProgram = selectedPrograms.length === 0 || selectedPrograms.includes(patient.program)
    
    return matchesSearch && matchesStatus && matchesProgram
  })

  const statuses = Array.from(new Set(patients.map((p) => p.status)))
  const programs = Array.from(new Set(patients.map((p) => p.program)))

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Get the current session token
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.access_token) {
        toast({
          title: "Authentication error",
          description: "Please log in again to add patients.",
          variant: "destructive",
        })
        return
      }

      // Call the API to create patient and send invitation
      const response = await fetch('/api/patients/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          phone: values.phone,
          program: values.program,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to invite patient')
      }

      // Add new patient to the list with the real data
      const newPatient = {
        id: result.invitationId || `temp-${Date.now()}`, // Use invitationId or generate temp ID
        name: values.name,
        email: values.email,
        program: values.program,
        progress: 0,
        lastSession: "Never",
        status: "New",
        avatar: "",
      }
      
      setPatients([...patients, newPatient])
      setIsAddDialogOpen(false)
      form.reset()
      
      toast({
        title: "Patient invitation created",
        description: `${values.name} has been invited. Please send them this signup link: ${result.signupUrl}`,
      })
    } catch (error) {
      console.error('Error inviting patient:', error)
      toast({
        title: "Failed to invite patient",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={async () => {
              try {
                const { data: { session } } = await supabase.auth.getSession()
                if (!session?.access_token) {
                  toast({
                    title: "No session",
                    description: "Please log in first",
                    variant: "destructive",
                  })
                  return
                }

                const response = await fetch('/api/user/debug', {
                  headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                  },
                })
                const result = await response.json()
                console.log('Debug result:', result)
                toast({
                  title: "Debug info logged",
                  description: "Check console for user profile details",
                })
              } catch (error) {
                console.error('Debug error:', error)
                toast({
                  title: "Debug failed",
                  description: "Check console for error",
                  variant: "destructive",
                })
              }
            }}
          >
            Debug User
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" />
                <span>Add Patient</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Add New Patient</DialogTitle>
                <DialogDescription>
                  Add a new patient to your practice. They will receive an email invitation.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="patient@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="(555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="program"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Initial Program</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Knee Rehabilitation" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">Add Patient</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patients..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                <span>Status</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {statuses.map((status) => (
                <DropdownMenuCheckboxItem
                  key={status}
                  checked={selectedStatuses.includes(status)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedStatuses([...selectedStatuses, status])
                    } else {
                      setSelectedStatuses(selectedStatuses.filter((s) => s !== status))
                    }
                  }}
                >
                  {status}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                <span>Program</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Filter by Program</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {programs.map((program) => (
                <DropdownMenuCheckboxItem
                  key={program}
                  checked={selectedPrograms.includes(program)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedPrograms([...selectedPrograms, program])
                    } else {
                      setSelectedPrograms(selectedPrograms.filter((p) => p !== program))
                    }
                  }}
                >
                  {program}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="outline" className="gap-2">
            <ArrowUpDown className="h-4 w-4" />
            <span>Sort</span>
          </Button>
        </div>
      </div>

      {selectedStatuses.length > 0 || selectedPrograms.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {selectedStatuses.map((status) => (
            <Badge key={status} variant="secondary" className="gap-1">
              {status}
              <button
                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick={() => setSelectedStatuses(selectedStatuses.filter((s) => s !== status))}
              >
                ×
              </button>
            </Badge>
          ))}
          {selectedPrograms.map((program) => (
            <Badge key={program} variant="secondary" className="gap-1">
              {program}
              <button
                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick={() => setSelectedPrograms(selectedPrograms.filter((p) => p !== program))}
              >
                ×
              </button>
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-sm"
            onClick={() => {
              setSelectedStatuses([])
              setSelectedPrograms([])
            }}
          >
            Clear all
          </Button>
        </div>
      ) : null}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Program</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Last Session</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.map((patient, index) => (
              <TableRow key={patient.id || `patient-${index}`}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={patient.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {patient.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{patient.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {patient.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{patient.program}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={patient.progress} className="h-2 w-[60px]" />
                    <span className="text-sm font-medium">{patient.progress}%</span>
                  </div>
                </TableCell>
                <TableCell>{patient.lastSession}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      patient.status === "Active"
                        ? "default"
                        : patient.status === "At Risk"
                        ? "destructive"
                        : "outline"
                    }
                  >
                    {patient.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/provider/patients/${patient.id}`}>
                          View Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>Assign Program</DropdownMenuItem>
                      <DropdownMenuItem>Send Message</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        Remove Patient
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
