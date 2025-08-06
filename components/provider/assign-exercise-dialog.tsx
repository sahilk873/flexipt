import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/use-auth"
import { Exercise } from "@/lib/supabase"

interface Props {
  patientId: string
  onAssigned: () => void
}

export function AssignExerciseDialog({ patientId, onAssigned }: Props) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [exercises, setExercises] = useState<Pick<Exercise, "id" | "name">[]>([])
  const [exerciseId, setExerciseId] = useState<string>("")
  const [sets, setSets] = useState("")
  const [reps, setReps] = useState("")

  useEffect(() => {
    if (open) {
      supabase
        .from("exercises")
        .select("id, name")
        .then(({ data }) => setExercises(data || []))
    }
  }, [open])

  const handleAssign = async () => {
    if (!exerciseId || !sets || !reps || !user) return
    await supabase.from("patient_exercises").insert({
      patient_id: patientId,
      exercise_id: exerciseId,
      sets: Number(sets),
      reps: Number(reps),
      assigned_by: user.id,
    })
    setExerciseId("")
    setSets("")
    setReps("")
    setOpen(false)
    onAssigned()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Assign Exercise
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Exercise</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <Select value={exerciseId} onValueChange={setExerciseId}>
            <SelectTrigger>
              <SelectValue placeholder="Select exercise" />
            </SelectTrigger>
            <SelectContent>
              {exercises.map((ex) => (
                <SelectItem key={ex.id} value={ex.id}>
                  {ex.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              placeholder="Sets"
              value={sets}
              onChange={(e) => setSets(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Reps"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleAssign}>Assign</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
