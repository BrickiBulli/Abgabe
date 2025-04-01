import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const pepper = process.env.PEPPER_SECRET || 'development_pepper';

async function generateSalt(): Promise<string> {
  return await bcrypt.genSalt(10);
}

async function hashPassword(password: string, salt: string): Promise<string> {
  // First add the pepper to the password, then hash with the salt
  return await bcrypt.hash(password + pepper, salt);
}

// Helper function to create a user
async function createUser(username: string, email: string, password: string, role: number) {
  const salt = await generateSalt();
  const hashedPassword = await hashPassword(password, salt);
  
  return await prisma.user.create({
    data: {
      username,
      password_hash: hashedPassword,
      password_salt: salt,
      email,
      role,
    },
  });
}

async function main() {
  console.log('Starting seeding...');

  // Clear existing data
  await prisma.task.deleteMany({});
  await prisma.loginAttempt.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Cleared existing data');
  
  // Create admin users
  const admin1 = await createUser('admin', 'admin@example.com', 'Admin123!', 2);
  const admin2 = await createUser('superadmin', 'super@example.com', 'Super123!', 2);
  
  console.log('Created admin users');

  // Create developers team
  const dev1 = await createUser('johndoe', 'john.doe@example.com', 'User123!', 1);
  const dev2 = await createUser('janedoe', 'jane.doe@example.com', 'User456!', 1);
  const dev3 = await createUser('mikerogers', 'mike.rogers@example.com', 'Mike123!', 1);
  const dev4 = await createUser('sarahparker', 'sarah.parker@example.com', 'Sarah123!', 1);
  
  // Create design team
  const design1 = await createUser('alexyang', 'alex.yang@example.com', 'Alex123!', 1);
  const design2 = await createUser('lucybrown', 'lucy.brown@example.com', 'Lucy123!', 1);
  
  // Create marketing team
  const marketing1 = await createUser('jamessmith', 'james.smith@example.com', 'James123!', 1);
  const marketing2 = await createUser('emilyjones', 'emily.jones@example.com', 'Emily123!', 1);
  
  console.log('Created team users');

  // Calculate dates
  const today = new Date();
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
  
  const threeDays = new Date(today);
  threeDays.setDate(threeDays.getDate() + 3);
  
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  const inTwoWeeks = new Date(today);
  inTwoWeeks.setDate(inTwoWeeks.getDate() + 14);
  
  const inThreeWeeks = new Date(today);
  inThreeWeeks.setDate(inThreeWeeks.getDate() + 21);
  
  const inOneMonth = new Date(today);
  inOneMonth.setDate(inOneMonth.getDate() + 30);

  // Admin tasks
  const adminTasks = [
    // Admin1 personal tasks
    {
      title: 'Review project requirements',
      description: 'Go through the client requirements and prepare documentation',
      duedate: tomorrow,
      status: 0, // Pending
      user_id: admin1.id,
    },
    {
      title: 'Update security protocols',
      description: 'Implement new security measures for the main application',
      duedate: nextWeek,
      status: 0, // Pending
      user_id: admin1.id,
    },
    {
      title: 'Quarterly planning session',
      description: 'Prepare roadmap for Q3',
      duedate: inTwoWeeks,
      status: 0, // Pending
      user_id: admin1.id,
    },
    {
      title: 'Budget review',
      description: 'Finalize department budgets for the next quarter',
      duedate: nextWeek,
      status: 1, // Completed
      user_id: admin1.id,
    },
    
    // Admin2 personal tasks
    {
      title: 'Infrastructure review',
      description: 'Audit cloud infrastructure and security settings',
      duedate: threeDays,
      status: 0, // Pending
      user_id: admin2.id,
    },
    {
      title: 'Licensing renewal',
      description: 'Renew software licenses before expiration',
      duedate: inTwoWeeks,
      status: 0, // Pending
      user_id: admin2.id,
    },
    {
      title: 'Team performance reviews',
      description: 'Complete quarterly performance evaluations',
      duedate: inThreeWeeks,
      status: 0, // Pending
      user_id: admin2.id,
    },
  ];
  
  // Tasks assigned by admins to developers
  const developmentTasks = [
    // Tasks for dev1
    {
      title: 'Frontend dashboard changes',
      description: 'Implement the new UI design for the dashboard based on the mockups',
      duedate: inTwoWeeks,
      status: 0, // Pending
      user_id: dev1.id,
    },
    {
      title: 'Bug fixes for release',
      description: 'Address critical bugs tagged for next release',
      duedate: nextWeek,
      status: 0, // Pending
      user_id: dev1.id,
    },
    {
      title: 'Code documentation update',
      description: 'Update inline code documentation for new features',
      duedate: inThreeWeeks,
      status: 0, // Pending
      user_id: dev1.id,
    },
    {
      title: 'Refactor authentication module',
      description: 'Improve code structure and performance',
      duedate: tomorrow,
      status: 1, // Completed
      user_id: dev1.id,
    },
    
    // Tasks for dev2
    {
      title: 'API documentation',
      description: 'Update the API documentation with the new endpoints',
      duedate: nextWeek,
      status: 0, // Pending
      user_id: dev2.id,
    },
    {
      title: 'Implement user analytics',
      description: 'Add tracking for key user actions',
      duedate: inTwoWeeks,
      status: 0, // Pending
      user_id: dev2.id,
    },
    {
      title: 'Database optimization',
      description: 'Review and optimize database queries',
      duedate: threeDays,
      status: 1, // Completed
      user_id: dev2.id,
    },
    
    // Tasks for dev3
    {
      title: 'Mobile responsiveness',
      description: 'Fix mobile layout issues on small screens',
      duedate: nextWeek,
      status: 0, // Pending
      user_id: dev3.id,
    },
    {
      title: 'Integration tests',
      description: 'Write integration tests for new features',
      duedate: inTwoWeeks,
      status: 0, // Pending
      user_id: dev3.id,
    },
    {
      title: 'Performance optimization',
      description: 'Improve load times of the main dashboard',
      duedate: inThreeWeeks,
      status: 0, // Pending
      user_id: dev3.id,
    },
    
    // Tasks for dev4
    {
      title: 'Security audit findings',
      description: 'Address security vulnerabilities found in recent audit',
      duedate: tomorrow,
      status: 0, // Pending
      user_id: dev4.id,
    },
    {
      title: 'DevOps pipeline improvements',
      description: 'Update CI/CD pipeline for faster deployments',
      duedate: nextWeek,
      status: 0, // Pending
      user_id: dev4.id,
    },
    {
      title: 'Containerize application',
      description: 'Create Docker setup for development environment',
      duedate: inTwoWeeks,
      status: 1, // Completed
      user_id: dev4.id,
    },
  ];
  
  // Tasks for design team
  const designTasks = [
    // Tasks for design1
    {
      title: 'Landing page redesign',
      description: 'Create new mockups for the landing page',
      duedate: nextWeek,
      status: 0, // Pending
      user_id: design1.id,
    },
    {
      title: 'Icon set update',
      description: 'Refresh the icon set used throughout the application',
      duedate: inTwoWeeks,
      status: 0, // Pending
      user_id: design1.id,
    },
    {
      title: 'Design system documentation',
      description: 'Document design guidelines and component usage',
      duedate: inThreeWeeks,
      status: 1, // Completed
      user_id: design1.id,
    },
    
    // Tasks for design2
    {
      title: 'Mobile app UI design',
      description: 'Design the interface for the upcoming mobile app',
      duedate: tomorrow,
      status: 0, // Pending
      user_id: design2.id,
    },
    {
      title: 'User testing preparation',
      description: 'Create prototypes for upcoming user testing sessions',
      duedate: nextWeek,
      status: 0, // Pending
      user_id: design2.id,
    },
    {
      title: 'Email template redesign',
      description: 'Update email notification templates',
      duedate: inTwoWeeks,
      status: 1, // Completed
      user_id: design2.id,
    },
  ];
  
  // Tasks for marketing team
  const marketingTasks = [
    // Tasks for marketing1
    {
      title: 'Content calendar',
      description: 'Plan content for social media and blog for next month',
      duedate: nextWeek,
      status: 0, // Pending
      user_id: marketing1.id,
    },
    {
      title: 'Quarterly newsletter',
      description: 'Draft the quarterly newsletter for customers',
      duedate: inTwoWeeks,
      status: 0, // Pending
      user_id: marketing1.id,
    },
    {
      title: 'Website analytics review',
      description: 'Analyze website traffic and conversion rates',
      duedate: inThreeWeeks,
      status: 1, // Completed
      user_id: marketing1.id,
    },
    
    // Tasks for marketing2
    {
      title: 'Product launch campaign',
      description: 'Develop marketing campaign for new product launch',
      duedate: dayAfterTomorrow,
      status: 0, // Pending
      user_id: marketing2.id,
    },
    {
      title: 'Customer testimonials',
      description: 'Collect and prepare customer success stories',
      duedate: nextWeek,
      status: 0, // Pending
      user_id: marketing2.id,
    },
    {
      title: 'SEO improvement plan',
      description: 'Identify opportunities to improve search rankings',
      duedate: inTwoWeeks,
      status: 1, // Completed
      user_id: marketing2.id,
    },
  ];
  
  // Personal tasks for everyone (miscellaneous)
  const personalTasks = [
    {
      title: 'Update personal development plan',
      description: 'Review goals and set new learning objectives',
      duedate: inOneMonth,
      status: 0, // Pending
      user_id: dev1.id,
    },
    {
      title: 'Prepare conference talk',
      description: 'Draft slides for upcoming industry conference',
      duedate: inOneMonth,
      status: 0, // Pending
      user_id: dev2.id,
    },
    {
      title: 'Research new frontend frameworks',
      description: 'Evaluate emerging frameworks for potential future use',
      duedate: inOneMonth,
      status: 0, // Pending
      user_id: dev3.id,
    },
    {
      title: 'Book team building venue',
      description: 'Find and reserve location for team outing',
      duedate: nextWeek,
      status: 0, // Pending
      user_id: admin1.id,
    },
    {
      title: 'Update portfolio website',
      description: 'Add recent projects to personal portfolio',
      duedate: inThreeWeeks,
      status: 0, // Pending
      user_id: design1.id,
    },
  ];

  // Combine all tasks
  const allTasks = [
    ...adminTasks,
    ...developmentTasks,
    ...designTasks,
    ...marketingTasks,
    ...personalTasks
  ];

  // Create all tasks
  await prisma.task.createMany({
    data: allTasks,
  });
  
  console.log(`Created ${allTasks.length} tasks for all users`);

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });