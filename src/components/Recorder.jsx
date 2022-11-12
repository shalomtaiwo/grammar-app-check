import React from "react";
import { IconButton } from "@mui/material";
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';

function App({
	handleListen,
	handleSend,
    isListening,
    setIsListening,
    setNote,
    startRecording,
    stopRecording
}) {
    const listenText = ()=>{
        setNote('');
        setIsListening(true);
        startRecording()
        handleListen();
    }

    const stopListen = () =>{
        handleSend();
        stopRecording();
    }
	return (
		<>
			<div>
				<div id="sendBtn">
					{isListening === false ? (
                        <IconButton onClick={listenText} color="primary" >
                            <KeyboardVoiceIcon />
                        </IconButton>
					) : (
						<IconButton onClick={stopListen} color="error" >
                            <KeyboardVoiceIcon />
                        </IconButton>
					)}
					{/* <button
						onClick={handleSaveNote}
						disabled={!note}
					>
						Save Note
					</button> */}
				</div>
				{/* <div className="box">
          <h2>Notes</h2>
          {savedNotes.map((n) => (
            <p key={n}>{n}</p>
          ))}
        </div> */}
			</div>
		</>
	);
}

export default App;
