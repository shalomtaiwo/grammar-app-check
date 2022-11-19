import { useRef, useState, useEffect, useCallback } from "react";
import { useAudioRecorder } from "@sarafhbk/react-audio-recorder";
import SpeechRecognition, {
	useSpeechRecognition,
} from "react-speech-recognition";
import Recorder from "./Recorder";
import Chats from "./Chats";
import io from 'socket.io-client';
import env from "react-dotenv";


const ChatContainer = () => {
	const textRef = useRef(null);
	const chatHistory = useRef("Hi, how are you doing?")
	const [isListening, setIsListening] = useState(false);
	const [note, setNote] = useState(null);
	const { transcript, browserSupportsSpeechRecognition, resetTranscript } =
		useSpeechRecognition({ clearTranscriptOnListen: true });

	const {
		audioResult,
		// timer,
		startRecording,
		stopRecording,
		// status,
		// errorMessage,
	} = useAudioRecorder();

	const [socket, setSocket] = useState(null);

	useEffect(() => {
	  const newSocket = io(env.SERVER_URL);
	  setSocket(newSocket);
	  return () => newSocket.close();
	}, [setSocket]);
  



	const handleListen = useCallback(() => {
		try {
			SpeechRecognition.startListening({ continuous: false});
		} catch (error) {
			console.log(error);
		}
		setNote(transcript);
	}, [transcript]);

	useEffect(() => {
		handleListen();
	}, [handleListen]);



	const handleSendText = ()=>{
		let text = textRef.current.value;
		setHistory(text);
		socket.emit("userMessage", text);

		let data = {
			method: 'POST',
			body: JSON.stringify({text, isAudio:false, chatHistory: chatHistory.current}),
			headers: { 'Content-Type': 'application/json' }
		  };

		  textRef.current.value = "";

		  fetch('http://127.0.0.1:3000/conversation', data)
		  .catch(err=>console.log(err))

	}

	const handleSend = async () => {
		setIsListening(false);
		SpeechRecognition.abortListening();
		

		let data = {
			method: 'POST',
			body: JSON.stringify({text:note, isAudio:true}),
			headers: { 'Content-Type': 'application/json' }
		  }
	  
		  fetch('http://127.0.0.1:3000/conversation', data)
		  .catch(err=>console.log(err))
		  resetTranscript();
		  
	};

  const setHistory = (msg)=>{
	chatHistory.current = `${chatHistory.current}|${msg}`;

  }

	if (!browserSupportsSpeechRecognition) {
		return <span>Browser doesn't support speech recognition please use the Chrome Browser.</span>;
	}
	return socket?(
		<div className="container">
			<Chats socket={socket} setHistory={setHistory}/>

			<div className="textbox">
				<audio controls src={audioResult} />
				<textarea
					name="speech"
					id="speech"
					//value={note ? note : ""}
					onChange={() => note ? note : ""}
					rows="2"
					ref={textRef}
				></textarea>
				<div>
					<Recorder
						note={note}
						isListening={isListening}
						handleListen={handleListen}
						setIsListening={setIsListening}
						handleSend={handleSend}
						setNote={setNote}
						startRecording={startRecording}
						stopRecording={stopRecording}
					/>
					<button onClick={handleSendText}>Send</button>
				</div>
			</div>
		</div>
	):(<div>Not connected</div>);
};

export default ChatContainer;
