import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/db';
import { TaskStatus } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  switch (req.method) {
    case 'PUT':
      try {
        const { status } = req.body;
        if (!status || !Object.values(TaskStatus).includes(status)) {
          return res.status(400).json({ error: 'Invalid status' });
        }
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
