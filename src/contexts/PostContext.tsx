import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useRef,
  useState,
} from "react";


interface PostContextProps {
  audioUrl: string | null
  setAudioUrl: Dispatch<SetStateAction<string | null>>;
  // audioBlob: Blob;
  // setAudioBlob: Dispatch<SetStateAction<Blob>>;
  startRecording: () => Promise<void>
  stopRecording: () => void
  isRecording: boolean

}

export const PostContext = createContext<PostContextProps>({
  audioUrl: "",
  setAudioUrl: () => {},
  // audioBlob: new Blob(),
  // setAudioBlob: () => {},
  startRecording: () => Promise.resolve(),
  stopRecording: () => {},
  isRecording: false
});

export const PostProvider = ({ children }: { children: ReactNode }) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioStreamRef = useRef<MediaStream | null>(null);

  const startRecording = async () => {
    setIsRecording(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
        audioChunksRef.current = [];
      };

      mediaRecorder.start();
    } catch (error) {
      console.error("Error accessing the microphone:", error);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
    }
  };


  const value: PostContextProps = {
    stopRecording,
    startRecording,
    audioUrl,
    isRecording,
    setAudioUrl
  };
  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};