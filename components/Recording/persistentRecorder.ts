import { getSyncFileHandle } from '@/lib/opfs-utils';

let syncRecFileHandle: FileSystemSyncAccessHandle;

onmessage = async ({ data: { type, chunkData } }) => {
  if (!syncRecFileHandle) {
    syncRecFileHandle = await getSyncFileHandle(`test.webm`);
    syncRecFileHandle.truncate(0)
  }

  switch (type) {
    case 'data':
      {
        const mediaData = await (chunkData as Blob).arrayBuffer();
        const writtenBytes = syncRecFileHandle.write(mediaData);
        syncRecFileHandle.flush()
        break;
      }
    case 'close':
      syncRecFileHandle.close();
      break;
    default:
      break;
  }
};

