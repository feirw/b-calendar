import { Directory, File, Paths } from 'expo-file-system';

function photosDirectory() {
  const directory = new Directory(Paths.document, 'photos');
  if (!directory.exists) {
    directory.create();
  }
  return directory;
}

function extensionFor(uri: string, mimeType?: string | null) {
  if (mimeType === 'image/png') return 'png';
  if (mimeType === 'image/webp') return 'webp';
  if (mimeType === 'image/gif') return 'gif';
  if (mimeType === 'image/heic') return 'heic';
  const match = uri.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
  const extension = match?.[1]?.toLowerCase();
  if (extension === 'jpeg') return 'jpg';
  if (extension && ['jpg', 'png', 'webp', 'heic', 'gif'].includes(extension)) {
    return extension;
  }
  return 'jpg';
}

export async function saveBirthdayPhoto(
  sourceUri: string,
  birthdayId: string,
  mimeType?: string | null,
) {
  const fileName = `${birthdayId}.${extensionFor(sourceUri, mimeType)}`;
  const destination = new File(photosDirectory(), fileName);
  if (destination.exists) {
    destination.delete();
  }
  await new File(sourceUri).copy(destination);
  return fileName;
}

export function birthdayPhotoUri(fileName: string | null) {
  if (!fileName) return null;
  try {
    const file = new File(photosDirectory(), fileName);
    return file.exists ? file.uri : null;
  } catch {
    return null;
  }
}

export function deleteBirthdayPhoto(fileName: string | null) {
  if (!fileName) return;
  try {
    const file = new File(photosDirectory(), fileName);
    if (file.exists) {
      file.delete();
    }
  } catch {
    // The birthday can still be removed if the file is already gone.
  }
}
