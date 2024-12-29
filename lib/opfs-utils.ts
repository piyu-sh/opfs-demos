

export const OPFS = {
  REC_FOLDER: 'recordings',
  LOGS_FOLDER: 'logs'
};


export async function getDirectoryHandle(dir: keyof typeof OPFS = 'REC_FOLDER') {
  try {
    if (navigator?.storage?.getDirectory) {
      const opfsRoot = await navigator.storage.getDirectory();
      const directory = OPFS[dir];
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
  filename: string,
  dir?: keyof typeof OPFS
) {
  try {
    const recDirHandle = await getDirectoryHandle(dir);
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
  dir?: keyof typeof OPFS
) {
  const recFileHandle = await getSyncOrAsyncFileHandle(filename, dir);
  return await recFileHandle!.createSyncAccessHandle();
}

export async function getAsyncFileHandle(
  filename: string,
  dir?: keyof typeof OPFS
) {
  const metaFileHandle = await getSyncOrAsyncFileHandle(filename, dir);
  return metaFileHandle;
}

//#region debug
async function listFiles() {
  const dir = await navigator.storage.getDirectory()
  const dirHandle = await dir.getDirectoryHandle('logs')
  // @ts-ignore
  for await (const [name, handle] of dirHandle.entries()) {
    if (handle.kind === 'file') {
      const file = await handle.getFile()
      console.log(name, file)
    }
  }
}

//#endregion