import { getSyncFileHandle } from '@/lib/opfs-utils';

let syncLogFileHandle: FileSystemSyncAccessHandle;
const textEncoder: TextEncoder = new TextEncoder();

onmessage = async ({ data: { type, filename, logData }, ports: [port] }) => {
  if (!syncLogFileHandle) {
    syncLogFileHandle = await getSyncFileHandle(filename, 'LOGS_FOLDER');
    syncLogFileHandle.truncate(0)
    port.postMessage({ type: 'gotFileHandle' })
  }

  switch (type) {
    case 'data':
      {
        // const logData = await (chunkData as Blob).arrayBuffer();
        const writtenBytes = syncLogFileHandle.write(textEncoder.encode(logData));
        syncLogFileHandle.flush()
        break;
      }
    case 'close':
      syncLogFileHandle.close();
      port.postMessage({ type: "closed" })
      break;
    default:
      break;
  }
};

