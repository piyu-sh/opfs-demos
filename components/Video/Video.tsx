
import { VideoHTMLAttributes, useEffect, useRef } from 'react'
import { VideoComp } from './video.style'

type PropsType = VideoHTMLAttributes<HTMLVideoElement> & {
  srcObject?: MediaStream
}

export default function Video({ srcObject, ...props }: PropsType) {
  const refVideo = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!refVideo.current) { return }
    // @ts-ignore
    refVideo.current.srcObject = srcObject
  }, [srcObject])

  return <VideoComp ref={refVideo} {...props} />
}