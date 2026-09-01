import { z } from 'zod'

export const courseFormSchema = z.object({
  nameEn: z
    .string()
    .min(1, { message: 'English name is required' })
    .max(100, { message: 'Name must be less than 100 characters' }),
  nameAr: z.string().optional(),
  code: z
    .string()
    .min(1, { message: 'Course code is required' })
    .max(20, { message: 'Code must be less than 20 characters' }),
  instructorEn: z.string().min(1, { message: 'Instructor name is required' }),
  instructorAr: z.string().optional(),
  credits: z
    .number({ message: 'Must be a valid number' })
    .min(1, { message: 'Credits must be at least 1' })
    .max(10, { message: 'Credits must be at most 10' }),
  color: z.string().min(1),
})

export type CourseFormData = z.infer<typeof courseFormSchema>
