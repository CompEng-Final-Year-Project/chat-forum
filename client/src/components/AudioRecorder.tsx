import React, {  useContext } from 'react';
import { Button } from './ui/button';
import { PostContext } from '@/contexts/PostContext';

const AudioRecorder: React.FC = () => {
  const {isRecording, startRecording, stopRecording} = useContext(PostContext)

 
  return (
    <div className=''>
      <Button type='button' onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </Button>  
    </div>
  );
};

export default AudioRecorder;
