"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowLeft, CheckCircle, ChevronRight, Dumbbell, Pause, Play, Repeat, Volume2, VolumeX } from 'lucide-react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"

export default function ExerciseSessionPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentRep, setCurrentRep] = useState(0)
  const [currentSet, setCurrentSet] = useState(1)
  const [formScore, setFormScore] = useState(85)
  const [isMuted, setIsMuted] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState("")
  const [isSessionComplete, setIsSessionComplete] = useState(false)
  const [painRating, setPainRating] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { toast } = useToast()

  // Mock exercise data
  const exercise = {
    name: "Knee Extension",
    sets: 3,
    reps: 10,
    videoUrl: "/placeholder.svg?height=400&width=600",
    instructions: "Sit on a chair with your back straight. Slowly extend your knee until your leg is straight, then slowly lower it back down. Keep your movements controlled.",
    targetMuscles: ["Quadriceps", "Knee stabilizers"],
  }

  // Simulated feedback messages
  const feedbackMessages = [
    "Keep your back straight",
    "Extend your knee fully",
    "Slow down the movement",
    "Great form!",
    "Hold at the top for 2 seconds",
  ]

  useEffect(() => {
    if (isPlaying) {
      // Simulate rep counting and feedback
      const repInterval = setInterval(() => {
        if (currentRep < exercise.reps) {
          setCurrentRep((prev) => prev + 1)
          
          // Random feedback (20% chance)
          if (Math.random() < 0.2) {
            const randomFeedback = feedbackMessages[Math.floor(Math.random() * feedbackMessages.length)]
            setFeedbackMessage(randomFeedback)
            setShowFeedback(true)
            
            setTimeout(() => {
              setShowFeedback(false)
            }, 3000)
          }
          
          // Random form score adjustment
          setFormScore((prev) => {
            const adjustment = Math.floor(Math.random() * 10) - 5
            return Math.min(100, Math.max(60, prev + adjustment))
          })
        } else {
          // Set complete
          clearInterval(repInterval)
          setIsPlaying(false)
          
          if (currentSet < exercise.sets) {
            toast({
              title: "Set complete!",
              description: `You've completed set ${currentSet}. Take a short rest before the next set.`,
            })
            setCurrentSet((prev) => prev + 1)
            setCurrentRep(0)
          } else {
            // Exercise complete
            setIsSessionComplete(true)
          }
        }
      }, 3000) // Each rep takes 3 seconds in this simulation
      
      return () => clearInterval(repInterval)
    }
  }, [isPlaying, currentRep, currentSet, exercise.reps, exercise.sets, toast])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const resetExercise = () => {
    setCurrentRep(0)
    setCurrentSet(1)
    setIsPlaying(false)
    setIsSessionComplete(false)
  }

  const handlePainRatingSubmit = () => {
    toast({
      title: "Session complete!",
      description: "Your exercise session has been recorded. Great job!",
    })
    
    // Redirect to exercises page after a delay
    setTimeout(() => {
      window.location.href = "/patient/exercises"
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/patient/exercises">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{exercise.name}</h1>
        </div>
        <Badge variant="outline" className="gap-1">
          <Dumbbell className="h-3.5 w-3.5" />
          <span>Set {currentSet} of {exercise.sets}</span>
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="overflow-hidden">
            <div className="relative aspect-video bg-black">
              {/* This would be replaced with a real webcam feed and pose estimation overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <video
                  ref={videoRef}
                  className="h-full w-full object-cover"
                  poster={exercise.videoUrl}
                  muted={isMuted}
                  loop
                >
                  <source src="/placeholder-video.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                
                {/* Pose estimation overlay would go here */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Skeleton overlay visualization would be rendered here */}
                </div>
                
                {/* Feedback message */}
                {showFeedback && (
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
                    {feedbackMessage}
                  </div>
                )}
                
                {/* Rep counter */}
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-4 py-2 rounded-full text-2xl font-bold">
                  {currentRep} / {exercise.reps}
                </div>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={togglePlay}
                        >
                          {isPlaying ? (
                            <Pause className="h-5 w-5" />
                          ) : (
                            <Play className="h-5 w-5" />
                          )}
                          <span className="sr-only">
                            {isPlaying ? "Pause" : "Play"}
                          </span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {isPlaying ? "Pause" : "Start"} Exercise
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={toggleMute}
                        >
                          {isMuted ? (
                            <VolumeX className="h-5 w-5" />
                          ) : (
                            <Volume2 className="h-5 w-5" />
                          )}
                          <span className="sr-only">
                            {isMuted ? "Unmute" : "Mute"}
                          </span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {isMuted ? "Unmute" : "Mute"} Audio
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={resetExercise}
                        >
                          <Repeat className="h-5 w-5" />
                          <span className="sr-only">Reset</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Reset Exercise</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Form Score:</span>
                  <div className="flex items-center gap-2">
                    <Progress value={formScore} className="h-2 w-24" />
                    <span className="text-sm font-medium">{formScore}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <h2 className="font-semibold mb-2">Instructions</h2>
              <p className="text-sm text-muted-foreground mb-4">
                {exercise.instructions}
              </p>
              
              <h3 className="font-semibold text-sm mb-1">Target Muscles</h3>
              <div className="flex flex-wrap gap-2">
                {exercise.targetMuscles.map((muscle) => (
                  <Badge key={muscle} variant="secondary">
                    {muscle}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h2 className="font-semibold mb-2">Real-time Feedback</h2>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Range of Motion</span>
                    <span className="font-medium">Good</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Movement Speed</span>
                    <span className="font-medium">Excellent</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Posture</span>
                    <span className="font-medium">Needs Work</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Button className="w-full gap-2" disabled={!isPlaying && currentRep === 0}>
            <CheckCircle className="h-4 w-4" />
            <span>Complete Exercise</span>
          </Button>
        </div>
      </div>

      {/* Session Complete Dialog */}
      <Dialog open={isSessionComplete} onOpenChange={setIsSessionComplete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exercise Complete!</DialogTitle>
            <DialogDescription>
              Great job! You've completed all sets of {exercise.name}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h3 className="font-medium">Session Summary</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Sets Completed:</div>
                <div className="font-medium">{exercise.sets}</div>
                <div>Total Reps:</div>
                <div className="font-medium">{exercise.sets * exercise.reps}</div>
                <div>Average Form Score:</div>
                <div className="font-medium">{formScore}%</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Rate your pain level</h3>
              <p className="text-sm text-muted-foreground">
                How would you rate your pain during this exercise? (0 = No pain, 10 = Severe pain)
              </p>
              <div className="flex items-center gap-4 pt-2">
                <span className="text-sm">0</span>
                <Slider
                  value={[painRating]}
                  min={0}
                  max={10}
                  step={1}
                  onValueChange={(value) => setPainRating(value[0])}
                  className="flex-1"
                />
                <span className="text-sm">10</span>
              </div>
              <div className="text-center font-medium mt-2">
                {painRating}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={handlePainRatingSubmit} className="gap-2">
              <ChevronRight className="h-4 w-4" />
              <span>Submit and Continue</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
