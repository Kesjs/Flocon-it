import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const errorData = await request.json();
    
    // Validation des données
    if (!errorData.message || !errorData.timestamp) {
      return NextResponse.json(
        { error: 'Invalid error data format' },
        { status: 400 }
      );
    }

    // Ajouter des métadonnées serveur
    const enrichedError = {
      ...errorData,
      serverTimestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || 
          request.headers.get('x-real-ip') || 
          'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      referer: request.headers.get('referer') || 'unknown',
    };

    // En production, vous pourriez :
    // 1. Envoyer vers Sentry, LogRocket, etc.
    // 2. Stocker dans une base de données
    // 3. Envoyer vers un webhook Slack/Discord
    
    // Pour l'instant, on stocke dans un fichier log (simple)
    if (process.env.NODE_ENV === 'production') {
      await logToFile(enrichedError);
    }

    // En développement, juste logger
    if (process.env.NODE_ENV === 'development') {
      console.log('🚨 Production Error Logged:', enrichedError);
    }

    return NextResponse.json(
      { success: true, logged: true },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error logging failed:', error);
    return NextResponse.json(
      { error: 'Failed to log error' },
      { status: 500 }
    );
  }
}

async function logToFile(errorData: any) {
  // Implémentation simple - dans la vraie production, 
  // utilisez un service externe (Sentry, DataDog, etc.)
  try {
    const fs = await import('fs').then(m => m.promises);
    const path = await import('path');
    
    const logDir = path.join(process.cwd(), 'logs');
    const logFile = path.join(logDir, 'errors.jsonl');
    
    // Créer le dossier logs s'il n'existe pas
    await fs.mkdir(logDir, { recursive: true });
    
    // Ajouter l'erreur au fichier (une ligne par erreur)
    const logLine = JSON.stringify(errorData) + '\n';
    await fs.appendFile(logFile, logLine);
    
  } catch (e) {
    // Échec silencieux du logging
    console.warn('Failed to write error to file:', e);
  }
}
