import { useEffect, useState } from "react";
import Chat from "./Chat";
import FeedBack from "./FeedBack";


const Chats = ({socket, setHistory})=>{
   console.log(socket)
    const [chats, setChats] = useState([
		{ isBot: true, text: "Hi, how are you doing?", isFeedBack: false },
	]);
    

    useEffect(() => {
        const messageListener = (message) => {
            console.log('message received');
            console.log(message)

            const response = JSON.parse(message.value);

            if(response.isError){

                setChats((curr) => [
                    ...curr,
                    { isBot: true, text: response.correctStatement, isFeedBack: true },
                ]);
            }

            
        };

        const botMessageListener = (message) => {
            console.log('message received', message.value);
            
                setChats((curr) => [
                    ...curr,
                    { isBot: true, text: message.value, isFeedBack: false },
                ]);

                setHistory(message.value);
            
        };

        const userMessageListener = (message) => {
            console.log('message received', message.value);
            
                setChats((curr) => [
                    ...curr,
                    { isBot: false, text: message.value, isFeedBack: false },
                ]);

            
        };
    
        socket.on('message', messageListener);
        socket.on('userMessage', userMessageListener);
        socket.on('botMessage', botMessageListener);
        
        
        return () => {
          socket.off('message', messageListener);
          socket.off('userMessage', userMessageListener);
          socket.off('botMessage', botMessageListener);
    
             };
      }, [socket]);


    return(
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
            )
                }
                </div>
    );
}

export default Chats;