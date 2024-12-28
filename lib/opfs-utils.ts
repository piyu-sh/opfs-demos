

export const OPFS = {
  REC_FOLDER: 'recordings'
};


export async function getDirectoryHandle() {
  try {
    if (navigator?.storage?.getDirectory) {
      const opfsRoot = await navigator.storage.getDirectory();
      const directory = OPFS.REC_FOLDER;
      const recDirHandle = await opfsRoot.getDirectoryHandle(directory, {
        create: true,
      });
      return recDirHandle;
    } else {
      console.error(
        "Upgrade to latest chromium based browser, your browser doesn't support all Beesy features(Persistent recording)"
      );
      return null;
    }
  } catch (error) {
    console.error('🚀 ~ getDirectoryHandle failed: ', error);
  }
}

async function getSyncOrAsyncFileHandle(
  filename: string
) {
  try {
    const recDirHandle = await getDirectoryHandle();
    const recFileHandle = await recDirHandle!.getFileHandle(filename, {
      create: true,
    });
    return recFileHandle;
  } catch (error) {
    console.error('🚀 ~ getSyncOrAsyncFileHandle failed:', error);
  }
}

export async function getSyncFileHandle(
  filename: string,
) {
  const recFileHandle = await getSyncOrAsyncFileHandle(filename);
  return await recFileHandle!.createSyncAccessHandle();
}

export async function getAsyncFileHandle(
  filename: string,
) {
  const metaFileHandle = await getSyncOrAsyncFileHandle(filename);
  return metaFileHandle;
}

