# Seeding Your Database

I've created an enhanced seed script that will populate your database with a rich set of example users and tasks organized by teams. This will help you quickly get started with testing and development.

## What the Seed Script Creates

### Admin Users

1. **Primary Admin**
   - Username: `admin`
   - Email: `admin@example.com`
   - Password: `Admin123!`
   - Role: Admin (2)

2. **Super Admin**
   - Username: `superadmin`
   - Email: `super@example.com`
   - Password: `Super123!`
   - Role: Admin (2)

### Development Team

1. **John Doe**
   - Username: `johndoe`
   - Email: `john.doe@example.com`
   - Password: `User123!`
   - Role: Regular (1)

2. **Jane Doe**
   - Username: `janedoe`
   - Email: `jane.doe@example.com`
   - Password: `User456!`
   - Role: Regular (1)

3. **Mike Rogers**
   - Username: `mikerogers`
   - Email: `mike.rogers@example.com`
   - Password: `Mike123!`
   - Role: Regular (1)

4. **Sarah Parker**
   - Username: `sarahparker`
   - Email: `sarah.parker@example.com`
   - Password: `Sarah123!`
   - Role: Regular (1)

### Design Team

1. **Alex Yang**
   - Username: `alexyang`
   - Email: `alex.yang@example.com`
   - Password: `Alex123!`
   - Role: Regular (1)

2. **Lucy Brown**
   - Username: `lucybrown`
   - Email: `lucy.brown@example.com`
   - Password: `Lucy123!`
   - Role: Regular (1)

### Marketing Team

1. **James Smith**
   - Username: `jamessmith`
   - Email: `james.smith@example.com`
   - Password: `James123!`
   - Role: Regular (1)

2. **Emily Jones**
   - Username: `emilyjones`
   - Email: `emily.jones@example.com`
   - Password: `Emily123!`
   - Role: Regular (1)

### Tasks

The seed script creates a comprehensive set of tasks:

- **Admin Tasks**: Personal tasks for both admin users
- **Development Team Tasks**: Technical tasks related to coding, testing, and documentation
- **Design Team Tasks**: UI/UX design and visual asset creation tasks
- **Marketing Team Tasks**: Content, SEO, and campaign-related tasks
- **Personal Tasks**: Miscellaneous tasks for various team members

Each user has multiple tasks with a mix of pending and completed status, and due dates ranging from tomorrow to one month in the future.

## Steps to Run the Seed Script

1. **Create the seed file**:
   - Create a file at `prisma/seed.ts` with the content provided
   - This script uses the same password hashing logic as your application

2. **Add ts-node as a dev dependency**:

   ```bash
   npm install --save-dev ts-node
   ```

3. **Update your package.json**:
   - Add the new script and configuration shown in the `package-json-update` artifact
   - This adds a `seed` command and configures Prisma to use this script

4. **Run the seed command**:

   ```bash
   npm run seed
   ```

   Or, with Prisma:

   ```bash
   npx prisma db seed
   ```

5. **Verify the data**:
   - Log in with the provided credentials to verify the users and tasks were created

## Note

The seed script will clear all existing users and tasks before creating new ones. Make sure you're not running this on a production database with data you want to keep!
