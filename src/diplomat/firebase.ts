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
    	console.warn('Firebase credentials not configured. File upload functionality will be disabled.');
    	return null;
    }

	firebaseApp = admin.initializeApp({
		credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
		storageBucket: `${serviceAccount.projectId}.appspot.com`,
	});

    console.log('Firebase initialized successfully');
    return firebaseApp;
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    return null;
  }
}

// Obter instância do Storage
export function getFirebaseStorage() {
  if (!firebaseApp) {
    const app = initializeFirebase();
    if (!app) {
      throw new Error('Firebase is not initialized. File upload functionality is disabled.');
    }
  }
  return getStorage();
}

// Função auxiliar para fazer upload de arquivo
export async function uploadFile(
  data: Buffer,
  soundId: string
) {
  try {
    const bucket = getFirebaseStorage().bucket(process.env.FIREBASE_STORAGE_BUCKET);
    const file = bucket.file(`sounds/${soundId}.mp3`);

    await file.save(data, {
      metadata: {
        contentType: 'audio/mpeg',
      },
    });

    // Tornar o arquivo público (opcional)
    await file.makePublic();

    return file.publicUrl();
  } catch (error) {
    console.error('Failed to upload file to Firebase:', error);
    throw error;
  }
}

// Função para deletar arquivo
export async function deleteFile(soundId: string) {
  try {
    const bucket = getFirebaseStorage().bucket(process.env.FIREBASE_STORAGE_BUCKET);
    const file = bucket.file(`sounds/${soundId}.mp3`);
    await file.delete();
    console.log(`Arquivo ${`sounds/${soundId}.mp3`} deletado com sucesso`);
  } catch (error) {
    console.error('Failed to delete file from Firebase:', error);
    throw error;
  }
}

export default firebaseApp;
