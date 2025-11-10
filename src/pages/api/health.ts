import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verificar variables de entorno
    const hasPostgresUrl = !!process.env.POSTGRES_PRISMA_URL;
    const hasDirectUrl = !!process.env.POSTGRES_URL_NON_POOLING;
    const nodeEnv = process.env.NODE_ENV;

    // Intentar conectar a la base de datos
    // Nota: No llamamos $disconnect() en serverless para reutilizar conexiones
    const taskCount = await prisma.task.count();

    return res.status(200).json({
      status: 'healthy',
      database: 'connected',
      taskCount,
      environment: {
        nodeEnv,
        hasPostgresUrl,
        hasDirectUrl,
      },
    });
  } catch (error) {
    console.error('Health check failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return res.status(500).json({
      status: 'unhealthy',
      error: errorMessage,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasPostgresUrl: !!process.env.POSTGRES_PRISMA_URL,
        hasDirectUrl: !!process.env.POSTGRES_URL_NON_POOLING,
      },
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
    });
  }
}

