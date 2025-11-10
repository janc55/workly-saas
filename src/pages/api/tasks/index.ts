import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/db';
import { z } from 'zod';

// Placeholder for a function that would get the current user
// In a real app, this would involve token verification, session checks, etc.
const getCurrentUser = async (req: NextApiRequest) => {
  // For now, we'll return a mock user.
  // In the future, this could return null if the user is not authenticated.
  return { id: 'clerk-user-id', role: 'ADMIN' };
};

const createTaskSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getCurrentUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const tasks = await prisma.task.findMany();
        res.status(200).json(tasks);
      } catch (error) {
        res.status(500).json({ error: 'Error fetching tasks' });
      }
      break;
    case 'POST':
      try {
        const validation = createTaskSchema.safeParse(req.body);
        if (!validation.success) {
          // Fix: Usa .format() para errores formateados por campo
          return res.status(400).json({ 
            error: validation.error.format() 
            // Alternativa: { error: validation.error.issues } para array de issues
          });
        }

        const { title, description } = validation.data;

        const task = await prisma.task.create({
          data: {
            title,
            description,
          },
        });
        res.status(201).json(task);
      } catch (error) {
        res.status(500).json({ error: 'Error creating task' });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}