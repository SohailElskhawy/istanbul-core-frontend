import { z } from 'zod'

export const taskFormSchema = z.object({
  titleEn: z
    .string()
    .min(1, { message: 'English title is required' })
    .max(100, { message: 'Title must be less than 100 characters' }),
  titleAr: z.string().optional(),
  descriptionEn: z.string().optional(),
  descriptionAr: z.string().optional(),
  courseId: z.string().min(1, { message: 'Course is required' }),
  priority: z.enum(['low', 'medium', 'high'] as const, {
    message: 'Priority is required',
  }),
  status: z.enum(['todo', 'in_progress', 'completed'] as const, {
    message: 'Status is required',
  }),
  dueDate: z.string().min(1, { message: 'Due date is required' }),
  estimatedMinutes: z
    .number({ message: 'Must be a valid number' })
    .min(1, { message: 'Estimated time must be at least 1 minute' })
    .max(1440, { message: 'Estimated time must be under 24 hours' }),
})

export type TaskFormData = z.infer<typeof taskFormSchema>
