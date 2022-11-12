import React from "react";
import { Button } from "antd";
import { AudioFilled } from '@ant-design/icons';


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
                        <Button
                        onClick={listenText}
                        type="primary"
                        shape="circle"
                        size="large"
                        icon={
                            <AudioFilled />
                        }
                    />
					) : (
						<Button
							onClick={stopListen}
							type="primary"
							shape="circle"
                            size="large"
                            danger
							icon={
								<AudioFilled />
							}
						/>
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
