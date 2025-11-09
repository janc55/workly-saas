import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/db';
import { TaskStatus } from '@prisma/client';
import { z } from 'zod';

// Placeholder for a function that would get the current user
const getCurrentUser = async (req: NextApiRequest) => {
  return { id: 'clerk-user-id', role: 'ADMIN' };
};

const updateTaskSchema = z.object({
  status: z.nativeEnum(TaskStatus),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getCurrentUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  switch (req.method) {
    case 'PUT':
      try {
        const validation = updateTaskSchema.safeParse(req.body);
        if (!validation.success) {
          // Fix: Usa .issues para array crudo o .format() para objeto formateado
          return res.status(400).json({ 
            error: validation.error.format() // Recomendado: más legible
            // Alternativa: { error: validation.error.issues } // Array de issues
          });
        }

        const { status } = validation.data;

        const task = await prisma.task.update({
          where: { id },
          data: { status },
        });
        res.status(200).json(task);
      } catch (error) {
        res.status(500).json({ error: 'Error updating task' });
      }
      break;
    case 'DELETE':
      try {
        // In a real app, you might want to check if the user has permission to delete.
        // e.g., if (user.role !== 'ADMIN') { return res.status(403).json({ error: 'Forbidden' }); }
        await prisma.task.delete({
          where: { id },
        });
        res.status(204).end();
      } catch (error) {
        res.status(500).json({ error: 'Error deleting task' });
      }
      break;
    default:
      res.setHeader('Allow', ['PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}