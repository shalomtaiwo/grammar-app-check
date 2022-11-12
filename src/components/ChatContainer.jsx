import { Configuration, OpenAIApi } from "openai";
import { useRef, useState, useEffect, useCallback } from "react";
import { useAudioRecorder } from "@sarafhbk/react-audio-recorder";
import SpeechRecognition, {
	useSpeechRecognition,
} from "react-speech-recognition";
import { Wave } from "@foobar404/wave";
// import { SpectrumVisualizer, SpectrumVisualizerTheme } from 'react-audio-visualizers';
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

	let audioElement = document.querySelector("#audio_record");
	let canvasElement = document.querySelector("#audio_visual");

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

	const handleVisual = useCallback(() => {
		let wave = new Wave(audioElement, canvasElement);

		// Simple example: add an animation
		wave.addAnimation(new wave.animations.Wave());

		// Intermediate example: add an animation with options
		wave.addAnimation(
			new wave.animations.Wave({
				lineWidth: 10,
				lineColor: "red",
				count: 20,
			})
		);

		// Expert example: add multiple animations with options
		wave.addAnimation(
			new wave.animations.Square({
				count: 50,
				diamater: 300,
			})
		);

		wave.addAnimation(
			new wave.animations.Glob({
				fillColor: { gradient: ["red", "blue", "green"], rotate: 45 },
				lineWidth: 10,
				lineColor: "black",
			})
		);
  },[audioElement, canvasElement]);

	const handleListen = useCallback(() => {
		try {
			SpeechRecognition.startListening({ continuous: true });
      handleVisual();
		} catch (error) {
			console.log(error);
		}
		setNote(transcript);
	}, [transcript, handleVisual]);

	useEffect(() => {
		handleListen();
	}, [handleListen]);

	const [chats, setChats] = useState([
		{ isBot: true, text: "Hi, how are you doing?", isFeedBack: false },
	]);

	const handleSend = async () => {
		setIsListening(false);
		SpeechRecognition.stopListening({ continuous: false });
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
						/>
					)
				)}
			</div>
			<audio
				controls
				src={audioResult}
				id="audio_record"
			/>
			<canvas
				id="audio_visual"
				height={200}
				width={500}
			></canvas>
			<div className="textbox">
				<textarea
					name="speech"
					id="speech"
					value={note ? note : ""}
					onChange={() => ""}
					rows="8"
					cols="40"
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
