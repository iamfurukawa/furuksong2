import admin from 'firebase-admin';
import { getStorage } from 'firebase-admin/storage';

let firebaseApp: admin.app.App | null = null;

export function initializeFirebase() {
  if (firebaseApp) {
    return firebaseApp;
  }

  try {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }

    if (!serviceAccount.projectId || !serviceAccount.privateKey || !serviceAccount.clientEmail) {
    	throw new Error('Firebase credentials not configured. Please set the environment variables.');
    }

	firebaseApp = admin.initializeApp({
		credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
		storageBucket: `${serviceAccount.projectId}.appspot.com`,
	});

    console.log('Firebase initialized successfully');
    return firebaseApp;
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    throw error;
  }
}

// Obter instância do Storage
export function getFirebaseStorage() {
  if (!firebaseApp) {
    initializeFirebase();
  }
  return getStorage();
}

// Função auxiliar para fazer upload de arquivo
export async function uploadFile(
  bucketName: string,
  filePath: string,
  destination: string,
  metadata?: { contentType?: string; [key: string]: any }
) {
  const bucket = getFirebaseStorage().bucket(bucketName);
  const file = bucket.file(destination);

  await file.save(filePath, {
    metadata: {
      contentType: metadata?.contentType || 'audio/mpeg',
      ...metadata,
    },
  });

  // Tornar o arquivo público (opcional)
  await file.makePublic();

  return file.publicUrl();
}

// Função auxiliar para fazer upload de buffer
export async function uploadBuffer(
  bucketName: string,
  buffer: Buffer,
  destination: string,
  metadata?: { contentType?: string; [key: string]: any }
) {
  const bucket = getFirebaseStorage().bucket(bucketName);
  const file = bucket.file(destination);

  await file.save(buffer, {
    metadata: {
      contentType: metadata?.contentType || 'audio/mpeg',
      ...metadata,
    },
  });

  await file.makePublic();

  return file.publicUrl();
}

// Função para deletar arquivo
export async function deleteFile(bucketName: string, destination: string) {
  const bucket = getFirebaseStorage().bucket(bucketName);
  const file = bucket.file(destination);
  await file.delete();
  console.log(`Arquivo ${destination} deletado com sucesso`);
}

export default firebaseApp;
