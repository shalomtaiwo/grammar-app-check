import { Configuration, OpenAIApi } from "openai";
import { useRef, useState, useEffect, useCallback } from "react";
import Recorder from "./Recorder";
import Chat from "./Chat";
import FeedBack from "./FeedBack";

const configuration = new Configuration({
	apiKey: process.env.REACT_APP_OPENAI_API,
});
const openai = new OpenAIApi(configuration);

const SpeechRecognition =
	window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();

mic.continuous = true;
mic.interimResults = true;
mic.lang = "en-US";


const ChatContainer = () => {
	const textRef = useRef(null);
	const [isListening, setIsListening] = useState(false);
	const [savedNotes, setSavedNotes] = useState([]);
	const [note, setNote] = useState(null);
	const history = ["AI: Hi, how are you doing?"];

	const handleListen = useCallback(() => {
		try {
			if (isListening) {
				mic.start();
				mic.onend = () => {
					console.log("continue..");
					mic.start();
				};
			} else {
				mic.stop();
				mic.onend = () => {
					console.log("Stopped Mic on Click");
				};
			}
		} catch {
			mic.onstart = () => {
				console.log("Mics on");
			};
		}

		mic.onresult = (event) => {
			console.log(Array.from(event.results))
			const transcript = Array.from(event.results)
				.map((result) => result[0])
				.map((result) => result.transcript)
				.join("");
			console.log(transcript);
			setNote(transcript);
			mic.onerror = (event) => {
				console.log(event.error);
			};
		};
	}, [isListening]);

	useEffect(() => {
		handleListen();
	}, [handleListen]);

	const handleSaveNote = () => {
		setSavedNotes([...savedNotes, note]);
		setNote("");
	};

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
	};

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

			<div className="textbox">
				<textarea
					name="speech"
					id="speech"
					value={note ? note : ""}
					onChange={() => (note ? note : "")}
					rows="8"
					cols="40"
					readOnly
					ref={textRef}
				></textarea>
				<div
					id="sendBtn"
					onClick={handleSend}
				>
					Send
				</div>
				<div id="recordButton">
					<Recorder
						isListening={isListening}
						note={note}
						handleSaveNote={handleSaveNote}
						setIsListening={setIsListening}
					/>
				</div>
			</div>
		</div>
	);
};

export default ChatContainer;
