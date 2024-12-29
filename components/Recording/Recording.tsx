"use client"
import { getAsyncFileHandle } from "@/lib/opfs-utils";
import { Accordion, AccordionItem, Button, Container, Group } from "@mantine/core";
import { init } from "opfs-tools-explorer";
import { useEffect, useRef, useState } from "react";
import { VideoComp } from "../Video/video.style";
let mediaRecorder: MediaRecorder;
let recordedBlobs: Array<Blob>
let stream: MediaStream | undefined;
let persistentRecorder: Worker | null;


export function RecordingComp() {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingDone, setRecordingDone] = useState(false)
  const [opfsFile, setOpfsFile] = useState<File>()
  const origVideo = useRef<HTMLVideoElement>(null)
  const recVideo = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    async function setOpfsState() {
      const recFile = await getOpfsFile()
      recFile?.size && setOpfsFile(recFile)
    }
    init()
    setOpfsState()
  }, [])

  async function getOpfsFile() {
    const asyncRecFileHandle = await getAsyncFileHandle(`test.webm`);
    const recFile = await asyncRecFileHandle?.getFile()
    return recFile
  }
  async function startCam() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 1280, height: 720
        }
      });
      return stream;
    } catch (e) {
      console.error('Source open error:', e);
    }
  }

  async function startRecording(persist = false) {
    stream = await startCam()
    if (!stream) { return null }
    console.log('Got stream:', stream);
    setIsRecording(true)
    origVideo.current!.srcObject = stream
    if (persist) {
      initialisePersistentRecording()
    }

    recordedBlobs = []

    const options = {
      mimeType: 'video/webm'
    }
    try {
      mediaRecorder = new MediaRecorder(stream, options);
    } catch (e) {
      console.error('Exception while creating MediaRecorder:', e);
    }

    console.log('Created MediaRecorder', mediaRecorder, 'with options', options);

    mediaRecorder.onstop = (event) => {
      console.log('Recorder stopped: ', event);
      console.log('Recorded Blobs: ', recordedBlobs);
      persistentRecorder?.postMessage({ type: 'close' })
      persistentRecorder?.terminate()
      persistentRecorder = null
    };

    mediaRecorder.ondataavailable = (ev) => handleDataAvailable(ev, persist);
    mediaRecorder.start(500);
    console.log('MediaRecorder started', mediaRecorder);

  }


  const handleDataAvailable = (event: BlobEvent, persist = false) => {
    console.log('handleDataAvailable', event);
    if (event.data && event.data.size > 0) {
      recordedBlobs.push(event.data);
      if (persist) {
        persistentRecorder?.postMessage({
          type: 'data',
          chunkData: event.data,
        });
      }
    }
  }

  function stopRecording() {
    mediaRecorder.stop();
    stream!.getTracks().forEach(stream => stream.stop())
    origVideo.current!.srcObject = null
    setRecordingDone(true)
    setIsRecording(false)
  }

  async function playOpfsRecording() {
    const recFile = await getOpfsFile()
    const recFileAB = await recFile?.arrayBuffer()
    playRecording(recFileAB)
  }
  async function downloadOpfsRecording() {
    const recFile = await getOpfsFile()
    const recFileAB = await recFile?.arrayBuffer()
    downloadRecording(recFileAB)
  }

  function playRecording(fileAB?: ArrayBuffer): void {
    const superBuffer = new Blob(fileAB ? [fileAB] : recordedBlobs, { type: 'video/webm' });
    recVideo.current!.src = window.URL.createObjectURL(superBuffer);
    recVideo.current!.controls = true;
    recVideo.current!.play();
  }

  function downloadRecording(fileAB?: ArrayBuffer) {
    const blob = new Blob(fileAB ? [fileAB] : recordedBlobs, { type: 'video/webm' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `test.webm`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  }

  function initialisePersistentRecording() {
    if (!persistentRecorder) {
      persistentRecorder = new Worker(
        new URL('./persistentRecorder', import.meta.url)
      );

      persistentRecorder.onerror = ev => {
        console.error('🚀 persistentRecorder ~ ev:', ev);
      };
    }
  }

  return (
    <Container>
      <Group justify='center'>
        <VideoComp id="gum-local" ref={origVideo} autoPlay playsInline muted />
        <VideoComp id="recorded" ref={recVideo} playsInline loop />
      </Group>

      <Accordion defaultValue="no-opfs" variant="contained" chevronPosition='left' mt='lg'>
        <AccordionItem value="no-opfs">
          <Accordion.Control>
            OPFS(Main Thread) 👌
          </Accordion.Control>
          <Accordion.Panel>
            <Group justify='center' mt="lg">
              <Button disabled={isRecording} onClick={() => startRecording()}>Start Recording(Main)</Button>
              <Button disabled={!isRecording} onClick={stopRecording}>Stop Recording(Main)</Button>
              <Button disabled={!recordingDone} onClick={() => playRecording()}>Play Recording(Main)</Button>
              <Button disabled={!recordingDone} onClick={() => downloadRecording()}>Download Recording(Main)</Button>
            </Group>
          </Accordion.Panel>
        </AccordionItem>
        <AccordionItem value="opfs">
          <Accordion.Control>
            OPFS(Web worker) 🚀
          </Accordion.Control>
          <Accordion.Panel>
            <Group justify='center' mt="lg">
              <Button disabled={isRecording} onClick={() => startRecording(true)}>Start Recording(Worker)</Button>
              <Button disabled={!isRecording} onClick={stopRecording}>Stop Recording(Worker)</Button>
              <Button disabled={!opfsFile && !recordingDone} onClick={playOpfsRecording}>Play Recording(Worker)</Button>
              <Button disabled={!opfsFile && !recordingDone} onClick={downloadOpfsRecording}>Download Recording(Worker)</Button>
            </Group>
          </Accordion.Panel>
        </AccordionItem>
      </Accordion>
    </Container>
  )
}