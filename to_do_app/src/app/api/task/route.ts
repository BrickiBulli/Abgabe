// pages/api/tasks/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db }from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      /**
       * CREATE a new task (POST)
       * Body example:
       * {
       *   title: string,
       *   description?: string,
       *   duedate: string,        // ISO date
       *   status: number,
       *   user_id: string
       * }
       */
      case 'POST': {
        const { title, description, duedate, status, user_id } = JSON.parse(req.body);

        // Basic validation checks here, if needed
        if (!title || !duedate || !user_id) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        const newTask = await db.task.create({
          data: {
            title,
            description,
            duedate: new Date(duedate),
            status,
            user_id,
          },
        });

        return res.status(201).json(newTask);
      }

      /**
       * READ (GET) - optional
       * For demonstration, we'll return all tasks.
       * In reality, you might:
       *   - Only return tasks for a specific user.
       *   - Or accept a query param to filter by user, etc.
       */
      case 'GET': {
        const tasks = await db.task.findMany();
        return res.status(200).json(tasks);
      }

      /**
       * UPDATE (PUT)
       * Body example:
       * {
       *   id: string,
       *   title: string,
       *   description?: string,
       *   duedate: string,  // ISO date
       *   status: number
       * }
       */
      case 'PUT': {
        const { id, title, description, duedate, status } = JSON.parse(req.body);

        if (!id) {
          return res.status(400).json({ error: 'Task ID is required for updating' });
        }

        const updatedTask = await db.task.update({
          where: { id },
          data: {
            title,
            description,
            duedate: new Date(duedate),
            status,
          },
        });

        return res.status(200).json(updatedTask);
      }

      /**
       * DELETE
       * Body example:
       * {
       *   id: string
       * }
       */
      case 'DELETE': {
        const { id } = JSON.parse(req.body);

        if (!id) {
          return res.status(400).json({ error: 'Task ID is required for deletion' });
        }

        await db.task.delete({ where: { id } });
        return res.status(204).end();
      }

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in /api/tasks:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
