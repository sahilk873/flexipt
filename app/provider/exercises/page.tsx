"use client"

import { useState } from "react"
import { ArrowUpDown, ChevronDown, Dumbbell, Filter, Plus, Search, Upload } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useToast } from "@/hooks/use-toast"

// Mock data for exercises
const exercisesData = [
  {
    id: 1,
    name: "Knee Extension",
    category: "Strength",
    bodyRegion: "Knee",
    difficulty: "Beginner",
    thumbnail: "/placeholder.svg?height=120&width=200",
  },
  {
    id: 2,
    name: "Shoulder External Rotation",
    category: "Mobility",
    bodyRegion: "Shoulder",
    difficulty: "Intermediate",
    thumbnail: "/placeholder.svg?height=120&width=200",
  },
  {
    id: 3,
    name: "Hip Abduction",
    category: "Strength",
    bodyRegion: "Hip",
    difficulty: "Beginner",
    thumbnail: "/placeholder.svg?height=120&width=200",
  },
  {
    id: 4,
    name: "Ankle Dorsiflexion",
    category: "Mobility",
    bodyRegion: "Ankle",
    difficulty: "Beginner",
    thumbnail: "/placeholder.svg?height=120&width=200",
  },
  {
    id: 5,
    name: "Lower Back Extension",
    category: "Strength",
    bodyRegion: "Back",
    difficulty: "Intermediate",
    thumbnail: "/placeholder.svg?height=120&width=200",
  },
  {
    id: 6,
    name: "Wrist Flexion",
    category: "Mobility",
    bodyRegion: "Wrist",
    difficulty: "Beginner",
    thumbnail: "/placeholder.svg?height=120&width=200",
  },
  {
    id: 7,
    name: "Neck Rotation",
    category: "Mobility",
    bodyRegion: "Neck",
    difficulty: "Beginner",
    thumbnail: "/placeholder.svg?height=120&width=200",
  },
  {
    id: 8,
    name: "Quad Strengthening",
    category: "Strength",
    bodyRegion: "Knee",
    difficulty: "Advanced",
    thumbnail: "/placeholder.svg?height=120&width=200",
  },
]

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  category: z.string().min(1, { message: "Please select a category" }),
  bodyRegion: z.string().min(1, { message: "Please select a body region" }),
  difficulty: z.string().min(1, { message: "Please select a difficulty level" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  videoUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
})

export default function ExerciseLibraryPage() {
  const [exercises, setExercises] = useState(exercisesData)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBodyRegions, setSelectedBodyRegions] = useState<string[]>([])
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "",
      bodyRegion: "",
      difficulty: "",
      description: "",
      videoUrl: "",
    },
  })

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(exercise.category)
    const matchesBodyRegion = selectedBodyRegions.length === 0 || selectedBodyRegions.includes(exercise.bodyRegion)
    const matchesDifficulty = selectedDifficulties.length === 0 || selectedDifficulties.includes(exercise.difficulty)
    
    return matchesSearch && matchesCategory && matchesBodyRegion && matchesDifficulty
  })

  const categories = Array.from(new Set(exercises.map((e) => e.category)))
  const bodyRegions = Array.from(new Set(exercises.map((e) => e.bodyRegion)))
  const difficulties = Array.from(new Set(exercises.map((e) => e.difficulty)))

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Add new exercise to the list
    const newExercise = {
      id: exercises.length + 1,
      name: values.name,
      category: values.category,
      bodyRegion: values.bodyRegion,
      difficulty: values.difficulty,
      thumbnail: `/placeholder.svg?height=120&width=200&query=${values.name} exercise`,
    }
    
    setExercises([...exercises, newExercise])
    setIsAddDialogOpen(false)
    form.reset()
    
    toast({
      title: "Exercise added",
      description: `${values.name} has been added to the library.`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Exercise Library</h1>
        <div className="flex flex-wrap items-center gap-4">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                <span>Add Exercise</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Add New Exercise</DialogTitle>
                <DialogDescription>
                  Create a new exercise for your library. Fill in the details below.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Exercise Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Knee Extension" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Strength">Strength</SelectItem>
                              <SelectItem value="Mobility">Mobility</SelectItem>
                              <SelectItem value="Balance">Balance</SelectItem>
                              <SelectItem value="Endurance">Endurance</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bodyRegion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Body Region</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Knee">Knee</SelectItem>
                              <SelectItem value="Shoulder">Shoulder</SelectItem>
                              <SelectItem value="Hip">Hip</SelectItem>
                              <SelectItem value="Ankle">Ankle</SelectItem>
                              <SelectItem value="Back">Back</SelectItem>
                              <SelectItem value="Neck">Neck</SelectItem>
                              <SelectItem value="Wrist">Wrist</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="difficulty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Difficulty</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Beginner">Beginner</SelectItem>
                              <SelectItem value="Intermediate">Intermediate</SelectItem>
                              <SelectItem value="Advanced">Advanced</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the exercise, including instructions and benefits..." 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="videoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Video URL (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/video.mp4" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">Add Exercise</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            <span>Import</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search exercises..."
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
                <span>Category</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {categories.map((category) => (
                <DropdownMenuCheckboxItem
                  key={category}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedCategories([...selectedCategories, category])
                    } else {
                      setSelectedCategories(selectedCategories.filter((c) => c !== category))
                    }
                  }}
                >
                  {category}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                <span>Body Region</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Filter by Body Region</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {bodyRegions.map((region) => (
                <DropdownMenuCheckboxItem
                  key={region}
                  checked={selectedBodyRegions.includes(region)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedBodyRegions([...selectedBodyRegions, region])
                    } else {
                      setSelectedBodyRegions(selectedBodyRegions.filter((r) => r !== region))
                    }
                  }}
                >
                  {region}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                <span>Difficulty</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Filter by Difficulty</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {difficulties.map((difficulty) => (
                <DropdownMenuCheckboxItem
                  key={difficulty}
                  checked={selectedDifficulties.includes(difficulty)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedDifficulties([...selectedDifficulties, difficulty])
                    } else {
                      setSelectedDifficulties(selectedDifficulties.filter((d) => d !== difficulty))
                    }
                  }}
                >
                  {difficulty}
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

      {selectedCategories.length > 0 || selectedBodyRegions.length > 0 || selectedDifficulties.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {selectedCategories.map((category) => (
            <Badge key={category} variant="secondary" className="gap-1">
              {category}
              <button
                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick={() => setSelectedCategories(selectedCategories.filter((c) => c !== category))}
              >
                ×
              </button>
            </Badge>
          ))}
          {selectedBodyRegions.map((region) => (
            <Badge key={region} variant="secondary" className="gap-1">
              {region}
              <button
                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick={() => setSelectedBodyRegions(selectedBodyRegions.filter((r) => r !== region))}
              >
                ×
              </button>
            </Badge>
          ))}
          {selectedDifficulties.map((difficulty) => (
            <Badge key={difficulty} variant="secondary" className="gap-1">
              {difficulty}
              <button
                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick={() => setSelectedDifficulties(selectedDifficulties.filter((d) => d !== difficulty))}
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
              setSelectedCategories([])
              setSelectedBodyRegions([])
              setSelectedDifficulties([])
            }}
          >
            Clear all
          </Button>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredExercises.map((exercise) => (
          <Card key={exercise.id} className="overflow-hidden">
            <div className="aspect-video bg-muted">
              <img
                src={exercise.thumbnail || "/placeholder.svg"}
                alt={exercise.name}
                className="h-full w-full object-cover"
              />
            </div>
            <CardContent className="p-4">
              <div className="flex flex-col space-y-2">
                <h3 className="font-semibold">{exercise.name}</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{exercise.category}</Badge>
                  <Badge variant="outline">{exercise.bodyRegion}</Badge>
                  <Badge variant="outline">{exercise.difficulty}</Badge>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Dumbbell className="h-4 w-4" />
                    <span className="sr-only">View Exercise</span>
                  </Button>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
