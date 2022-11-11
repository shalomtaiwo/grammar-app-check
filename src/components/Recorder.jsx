import React from "react";
import microphone from "./Assets/microphone.png";
import recording from "./Assets/recording.png";

function App({ note, isListening, handleSaveNote, setIsListening }) {
	return (
		<>
			<div>
				<div>
					{isListening === false ? (
						<span onClick={() => setIsListening((prevState) => !prevState)}>
							{" "}
							<img
								width={50}
								src={microphone}
								alt="microphone"
							/>{" "}
						</span>
					) : (
						<span onClick={() => setIsListening((prevState) => !prevState)}>
							<img
								width={50}
								src={recording}
								alt="microphone"
							/>
						</span>
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
