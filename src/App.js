// import "./App.css";
// import ChatContainer from "./components/ChatContainer";

// const App = () => {
//   return <ChatContainer />;
// };

// export default App;

import React from 'react'

import { useAudioRecorder } from '@sarafhbk/react-audio-recorder'

function App() {
  const {
    audioResult,
    timer,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    status,
    errorMessage
  } = useAudioRecorder()
  return (
    <div>
      <audio controls src={audioResult} />
      <p>
        Status : <b>{status}</b>
      </p>
      <p>
        Error Message : <b>{errorMessage}</b>
      </p>
      <div>
        <p>{new Date(timer * 1000).toISOString().substr(11, 8)}</p>
        <div>
          <button onClick={startRecording}>Start</button>
          <button onClick={stopRecording}>Stop</button>
          <button onClick={pauseRecording}>Pause</button>
          <button onClick={resumeRecording}>Resume</button>
        </div>
      </div>
    </div>
  )
}

export default App;
