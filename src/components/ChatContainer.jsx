import { Configuration, OpenAIApi } from "openai";
import { useRef, useState, useEffect, useCallback } from "react";
import { useAudioRecorder } from "@sarafhbk/react-audio-recorder";
import SpeechRecognition, {
	useSpeechRecognition,
} from "react-speech-recognition";
import Recorder from "./Recorder";
import Chat from "./Chat";
import FeedBack from "./FeedBack";

const configuration = new Configuration({
	apiKey: "",
});
const openai = new OpenAIApi(configuration);

const ChatContainer = () => {
	const textRef = useRef(null);
	const [isListening, setIsListening] = useState(false);
	const [note, setNote] = useState(null);
	const history = ["AI: Hi, how are you doing?"];
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

	const handleListen = useCallback(() => {
		try {
			SpeechRecognition.startListening({ continuous: true });
		} catch (error) {
			console.log(error);
		}
		setNote(transcript);
	}, [transcript]);

	useEffect(() => {
		handleListen();
	}, [handleListen]);

	const [chats, setChats] = useState([
		{ isBot: true, text: "Hi, how are you doing?", isFeedBack: false },
	]);

	const handleSend = async () => {
		setIsListening(false);
		let s = textRef.current.value;
		setChats((curr) => [
			...curr,
			{ isBot: false, text: textRef.current.value, isFeedBack: false },
		]);

		const response = await openai.createCompletion({
			model: "text-davinci-002",
			prompt:
				"Correct this to standard English:\n\n" +
				s +
				"\n\n| is_there_an_error | correct_sentence |",
			temperature: 0,
			max_tokens: 60,
			top_p: 1,
			frequency_penalty: 0,
			presence_penalty: 0,
		});

		let t = response.data.choices[0].text;

		const [isError, correctStatement] = t
			.split("\n")
			.pop()
			.split("|")
			.filter((w) => w.trim() !== "")
			.map((w) => w.trim());

		if (isError === "Yes") {
			setChats((curr) => [
				...curr,
				{ isBot: true, isFeedBack: true, text: correctStatement },
			]);
		}

		textRef.current.value = "";
		history.push("Human: " + correctStatement);

		const botResponse = await openai.createCompletion({
			model: "text-davinci-002",
			prompt: history.join("\n"),
			temperature: 0.9,
			max_tokens: 150,
			top_p: 1,
			frequency_penalty: 0,
			presence_penalty: 0.6,
			stop: [" Human:", " AI:"],
		});

		const botReply = botResponse.data.choices[0].text
			.split("\n")
			.pop()
			.slice(4);

		setChats((curr) => [
			...curr,
			{ isBot: true, text: botReply, isFeedBack: false },
		]);
		history.push("AI: " + botReply);
		SpeechRecognition.stopListening();
		resetTranscript();
	};
	if (!browserSupportsSpeechRecognition) {
		return <span>Browser doesn't support speech recognition.</span>;
	}
	return (
		<div className="container">
			<div className="chat">
				{chats.map((chat, i) =>
					chat.isFeedBack ? (
						<FeedBack
							key={i}
							text={chat.text}
						/>
					) : (
						<Chat
							key={i}
							isBot={chat.isBot}
							text={chat.text}
							audioResult={audioResult}
						/>
					)
				)}
			</div>

			<div className="textbox">
				<textarea
					name="speech"
					id="speech"
					value={note ? note : ""}
					onChange={() => ""}
					rows="2"
					readOnly
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
				</div>
			</div>
		</div>
	);
};

export default ChatContainer;
