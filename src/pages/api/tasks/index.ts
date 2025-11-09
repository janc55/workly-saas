import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
        const { title, description } = req.body;
        if (!title) {
          return res.status(400).json({ error: 'Title is required' });
        }
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
