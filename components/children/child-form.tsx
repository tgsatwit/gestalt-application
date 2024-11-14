"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { Child } from "@/lib/types"
import { CalendarIcon, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { format, subYears } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const childFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  dateOfBirth: z.date({
    required_error: "A date of birth is required.",
  }),
  gender: z.string().optional(),
  notes: z.string().optional(),
})

type ChildFormValues = z.infer<typeof childFormSchema>

interface ChildFormProps {
  initialData?: Partial<Child>
  onSubmit: (data: any) => Promise<void>
  onCancel?: () => void
}

export function ChildForm({ initialData, onSubmit, onCancel }: ChildFormProps) {
  const [loading, setLoading] = useState(false)
  const [calendarMonth, setCalendarMonth] = useState<Date>(
    initialData?.dateOfBirth ? new Date(initialData.dateOfBirth) : new Date()
  )

  // Convert string date to Date object for the form
  const getInitialDate = () => {
    if (!initialData?.dateOfBirth) return undefined
    const date = new Date(initialData.dateOfBirth)
    return isNaN(date.getTime()) ? undefined : date
  }

  const form = useForm<ChildFormValues>({
    resolver: zodResolver(childFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      dateOfBirth: getInitialDate(),
      gender: initialData?.gender || "",
      notes: initialData?.notes || "",
    },
  })

  const handleSubmit = async (data: ChildFormValues) => {
    setLoading(true)
    try {
      await onSubmit({
        ...data,
        dateOfBirth: data.dateOfBirth.toISOString(),
      })
      form.reset()
    } finally {
      setLoading(false)
    }
  }

  // Generate year options for the last 18 years
  const years = Array.from({ length: 18 }, (_, i) => {
    const year = new Date().getFullYear() - i
    return { value: year.toString(), label: year.toString() }
  })

  // Generate month options
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Child's name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="border-b border-border p-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <Select
                        value={calendarMonth.getFullYear().toString()}
                        onValueChange={(year) => {
                          const newDate = new Date(calendarMonth)
                          newDate.setFullYear(parseInt(year))
                          setCalendarMonth(newDate)
                        }}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem key={year.value} value={year.value}>
                              {year.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={calendarMonth.getMonth().toString()}
                        onValueChange={(month) => {
                          const newDate = new Date(calendarMonth)
                          newDate.setMonth(parseInt(month))
                          setCalendarMonth(newDate)
                        }}
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((month, index) => (
                            <SelectItem key={index} value={index.toString()}>
                              {month}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    month={calendarMonth}
                    onMonthChange={setCalendarMonth}
                    disabled={(date) =>
                      date > new Date() || date < subYears(new Date(), 18)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any additional information"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4 justify-end">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update" : "Add"} Child
          </Button>
        </div>
      </form>
    </Form>
  )
}