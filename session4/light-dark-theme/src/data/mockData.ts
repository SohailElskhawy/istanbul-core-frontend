export interface Product {
  id: number
  title: string
  category: string
  price: number
  rating: number
  icon: string
  description: string
  tags: string[]
}

export interface TeamMember {
  id: number
  name: string
  role: string
  avatar: string
  bio: string
  skills: string[]
}

export interface StatItem {
  id: number
  label: string
  value: string
  icon: string
}

export interface OfficeLocation {
  city: string
  country: string
  address: string
  phone: string
  email: string
  isHeadquarters?: boolean
}

export interface FAQItem {
  id: number
  question: string
  answer: string
}

export const mockProducts: Product[] = [
  {
    id: 1,
    title: 'React & TypeScript Mastery',
    category: 'Course',
    price: 89,
    rating: 4.9,
    icon: '⚛️',
    description: 'Learn modern React with TypeScript, Context API, Hooks, and React Router from industry experts.',
    tags: ['React', 'TypeScript', 'Frontend'],
  },
  {
    id: 2,
    title: 'Fullstack Next.js Toolkit',
    category: 'Framework',
    price: 119,
    rating: 4.8,
    icon: '⚡',
    description: 'Build fast, fullstack web applications with server components, streaming, and database integration.',
    tags: ['Next.js', 'Fullstack', 'SSR'],
  },
  {
    id: 3,
    title: 'Tailwind & Modern UI Architecture',
    category: 'Design',
    price: 65,
    rating: 4.7,
    icon: '🎨',
    description: 'Master component-driven design systems, accessibility best practices, and theme orchestration.',
    tags: ['CSS', 'UI/UX', 'Tailwind'],
  },
  {
    id: 4,
    title: 'Cloud & DevOps for Frontend Devs',
    category: 'DevOps',
    price: 99,
    rating: 4.95,
    icon: '🚀',
    description: 'Deploy, monitor, and scale modern web apps with CI/CD pipelines, Docker, and edge networks.',
    tags: ['Docker', 'CI/CD', 'Cloud'],
  },
]

export const mockStats: StatItem[] = [
  { id: 1, label: 'Active Students', value: '12,500+', icon: '👨‍💻' },
  { id: 2, label: 'Course Modules', value: '85+', icon: '📚' },
  { id: 3, label: 'Satisfaction Rate', value: '99.2%', icon: '⭐' },
  { id: 4, label: 'Partner Companies', value: '140+', icon: '🏢' },
]

export const mockTeam: TeamMember[] = [
  {
    id: 1,
    name: 'Sohail Elskhawy',
    role: 'Lead Frontend Instructor',
    avatar: '👨‍🏫',
    bio: 'Passionate frontend engineer and instructor specializing in React, TypeScript, and modern web architectures.',
    skills: ['React', 'TypeScript', 'State Management'],
  },
  {
    id: 2,
    name: 'Amina Yilmaz',
    role: 'Senior UI/UX Architect',
    avatar: '👩‍🎨',
    bio: 'Design systems engineer crafting accessible, beautiful, and intuitive user experiences.',
    skills: ['Figma', 'Design Systems', 'CSS/SCSS'],
  },
  {
    id: 3,
    name: 'Kerem Demir',
    role: 'Full-Stack Developer & Mentor',
    avatar: '🧑‍💻',
    bio: 'Dedicated mentor helping engineers transition from fundamentals to scalable production apps.',
    skills: ['Node.js', 'React', 'GraphQL'],
  },
]

export const mockOffices: OfficeLocation[] = [
  {
    city: 'Istanbul',
    country: 'Turkey',
    address: 'Levent Mah. Buyukdere Cad. No: 195, Besiktas',
    phone: '+90 (212) 555-0199',
    email: 'istanbul@coreistanbul.dev',
    isHeadquarters: true,
  },
  {
    city: 'Berlin',
    country: 'Germany',
    address: 'Friedrichstraße 43, 10117 Mitte',
    phone: '+49 30 12345678',
    email: 'berlin@coreistanbul.dev',
  },
]

export const mockFAQs: FAQItem[] = [
  {
    id: 1,
    question: 'How does nested routing work with React Router?',
    answer:
      'Nested routing allows child routes to render inside a parent component layout using the <Outlet /> component, preserving common layout elements like navigation and footers.',
  },
  {
    id: 2,
    question: 'How is theme switching persisted across routes?',
    answer:
      'Theme state is held at the App level inside a React Context Provider (ThemeContext), so every page and component accesses the current theme seamlessly without prop drilling.',
  },
  {
    id: 3,
    question: 'What happens when a user accesses a non-existent URL?',
    answer:
      'React Router catches unmatched URLs using the wildcard path="*" route, redirecting or rendering our custom NotFound component.',
  },
]

