import type { Task, Course, DashboardStats } from '../shared/types'

export const mockCourses: Course[] = [
  {
    id: 'course-1',
    name: {
      en: 'Data Structures & Algorithms',
      ar: 'هياكل البيانات والخوارزميات',
    },
    code: 'CS201',
    color: '#2d5a43', // Forest green
    instructor: {
      en: 'Dr. Alan Turing',
      ar: 'د. آلان تورينج',
    },
    credits: 4,
    description: {
      en: 'Core concepts of data structures, graph algorithms, and dynamic programming.',
      ar: 'المفاهيم الأساسية لهياكل البيانات، خوارزميات الرسوم البيانية، والبرمجة الديناميكية.',
    },
  },
  {
    id: 'course-2',
    name: {
      en: 'Linear Algebra & Matrices',
      ar: 'الجبر الخطي والمصفوفات',
    },
    code: 'MATH204',
    color: '#3b82f6', // Blue
    instructor: {
      en: 'Prof. Katherine Johnson',
      ar: 'أ.د. كاثرين جونسون',
    },
    credits: 3,
    description: {
      en: 'Vector spaces, eigenvalues, linear transformations, and matrix decompositions.',
      ar: 'الفضاءات الاتجاهية، القيم الذاتية، التحويلات الخطية، وتحليلات المصفوفات.',
    },
  },
  {
    id: 'course-3',
    name: {
      en: 'Operating Systems & Architecture',
      ar: 'نظم التشغيل وهيكلة الحواسيب',
    },
    code: 'CS301',
    color: '#b45309', // Amber
    instructor: {
      en: 'Dr. Grace Hopper',
      ar: 'د. جريس هوبر',
    },
    credits: 4,
    description: {
      en: 'Concurrency, virtual memory, process scheduling, and distributed file systems.',
      ar: 'التزامن والتوازي، الذاكرة الافتراضية، جدولة العمليات، ونظم الملفات الموزعة.',
    },
  },
  {
    id: 'course-4',
    name: {
      en: 'Database Management Systems',
      ar: 'نظم إدارة قواعد البيانات',
    },
    code: 'CS240',
    color: '#7c3aed', // Purple
    instructor: {
      en: 'Prof. Edgar Codd',
      ar: 'أ.د. إدجار كود',
    },
    credits: 3,
    description: {
      en: 'Relational data modeling, SQL optimization, ACID transactions, and indexing.',
      ar: 'نمذجة البيانات العلائقية، تحسين استعلامات SQL، معاملات ACID، والفهرسة.',
    },
  },
]

export const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: {
      en: 'Implement AVL Tree Rotations',
      ar: 'تنفيذ خوارزمية الدوران في أشجار AVL',
    },
    description: {
      en: 'Write self-balancing AVL tree insert and deletion algorithms with unit tests.',
      ar: 'كتابة خوارزميات الإدراج والحذف لأشجار AVL ذاتية التوازن مع الاختبارات البرمجية.',
    },
    courseId: 'course-1',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2026-09-04',
    estimatedMinutes: 90,
  },
  {
    id: 'task-2',
    title: {
      en: 'Solve Problem Set 3: Eigenvalues',
      ar: 'حل مجموعة التمارين 3: القيم الذاتية',
    },
    description: {
      en: 'Complete questions 1 through 8 on matrix diagonalization and characteristic polynomials.',
      ar: 'حل الأسئلة من 1 إلى 8 حول قطْرنة المصفوفات ومتعددات الحدود المميزة.',
    },
    courseId: 'course-2',
    status: 'todo',
    priority: 'high',
    dueDate: '2026-09-05',
    estimatedMinutes: 60,
  },
  {
    id: 'task-3',
    title: {
      en: 'Read OS Kernel Concurrency Chapter',
      ar: 'قراءة فصل التزامن في نواة نظم التشغيل',
    },
    description: {
      en: 'Study semaphores, mutex locks, and deadlock prevention algorithms.',
      ar: 'دراسة السيمافورات، أقفال الاستبعاد المتبادل، وخوارزميات منع التصلب الميت.',
    },
    courseId: 'course-3',
    status: 'todo',
    priority: 'medium',
    dueDate: '2026-09-06',
    estimatedMinutes: 45,
  },
  {
    id: 'task-4',
    title: {
      en: 'Design SQL Schema for Library System',
      ar: 'تصميم مخطط قاعدة بيانات نظام المكتبة',
    },
    description: {
      en: 'Create normalized relational schema (3NF) and add foreign key indexes.',
      ar: 'إنشاء مخطط علائقي قياسي (3NF) وإضافة فهارس المفاتيح الخارجية.',
    },
    courseId: 'course-4',
    status: 'completed',
    priority: 'medium',
    dueDate: '2026-09-02',
    estimatedMinutes: 75,
  },
  {
    id: 'task-5',
    title: {
      en: 'Graph Traversal Review (BFS & DFS)',
      ar: 'مراجعة خوارزميات اجتياز الرسوم البيانية (BFS و DFS)',
    },
    description: {
      en: 'Prepare notes and code implementations for upcoming midterms.',
      ar: 'إعداد الملاحظات والنماذج البرمجية للاختبارات النصفية القادمة.',
    },
    courseId: 'course-1',
    status: 'completed',
    priority: 'low',
    dueDate: '2026-09-01',
    estimatedMinutes: 30,
  },
  {
    id: 'task-6',
    title: {
      en: 'Vector Projection Proofs',
      ar: 'إثباتات الإسقاط الاتجاهي',
    },
    description: {
      en: 'Write formal mathematical proofs for Cauchy-Schwarz inequality applications.',
      ar: 'كتابة براهين رياضية رسمية لتطبيقات متباينة كوشي-شفارتز.',
    },
    courseId: 'course-2',
    status: 'todo',
    priority: 'medium',
    dueDate: '2026-09-08',
    estimatedMinutes: 50,
  },
  {
    id: 'task-7',
    title: {
      en: 'POSIX Thread Synchronization Lab',
      ar: 'مختبر مزامنة الخيوط (POSIX Threads)',
    },
    description: {
      en: 'Fix race conditions in dining philosophers simulation using pthread mutexes.',
      ar: 'معالجة حالات السباق في محاكاة معضلة الفلاسفة باستخدام أقفال pthread.',
    },
    courseId: 'course-3',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2026-09-07',
    estimatedMinutes: 120,
  },
  {
    id: 'task-8',
    title: {
      en: 'B+ Tree Indexing Performance Analysis',
      ar: 'تحليل أداء الفهرسة باستخدام أشجار +B',
    },
    description: {
      en: 'Compare query execution plans between full table scans and B+ tree indexes.',
      ar: 'مقارنة خطط تنفيذ الاستعلامات بين المسح الكامل للجدول وفهارس أشجار +B.',
    },
    courseId: 'course-4',
    status: 'todo',
    priority: 'low',
    dueDate: '2026-09-10',
    estimatedMinutes: 40,
  },
  {
    id: 'task-9',
    title: {
      en: 'Dynamic Programming: Knapsack Problem',
      ar: 'البرمجة الديناميكية: مسألة الحقيبة',
    },
    description: {
      en: 'Implement 0/1 knapsack and fractional knapsack solutions in code.',
      ar: 'تنفيذ حلول مسألة الحقيبة بنوعيها (0/1 والكسرية) برمجياً.',
    },
    courseId: 'course-1',
    status: 'todo',
    priority: 'medium',
    dueDate: '2026-09-12',
    estimatedMinutes: 60,
  },
]

export const calculateDashboardStats = (tasks: Task[], courses: Course[]): DashboardStats => {
  const completedTasks = tasks.filter((t) => t.status === 'completed').length
  const pendingTasks = tasks.filter((t) => t.status === 'todo').length
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length
  const totalStudyMinutes = tasks
    .filter((t) => t.status === 'completed')
    .reduce((acc, curr) => acc + curr.estimatedMinutes, 0)

  return {
    completedTasks,
    pendingTasks,
    inProgressTasks,
    activeCourses: courses.length,
    studyStreakDays: 5,
    totalStudyMinutes,
  }
}
