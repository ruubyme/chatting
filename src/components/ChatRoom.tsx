import { useState, useEffect } from "react";
import { getDatabase, onValue, push, ref, set, off } from "firebase/database";
import { app } from "../firebase";

type ChatRoom = {
  id: string;
  messages: Message[];
};

type Message = {
  name: string;
  text: string;
  timestamp: number;
};

type ChatProps = {
  name: string;
};

const db = getDatabase(app);

const ChatRoom: React.FC<ChatProps> = ({ name }) => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  function handleMessageChange(event: React.ChangeEvent<HTMLInputElement>) {
    setMessage(event.target.value);
  }

  async function handleMessageSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    //const db = getDatabase(app);
    const newMessageRef = push(ref(db, `room/messages`));
    const newMessage: Message = {
      name: name,
      text: message,
      timestamp: Date.now(),
    };
    await set(newMessageRef, newMessage);
    //setMessages((prevMessages) => [...prevMessages, { ...newMessage }]);
    setMessage("");
    console.log("메시지가 성공적으로 전송되었습니다.");
  }

  const messagesRef = ref(db, "room/messages");

  useEffect(() => {
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messagesData: Message[] = Object.values(data);
        setMessages(messagesData);
      }
    });
    return () => off(messagesRef);
  }, []);

  console.log(message);

  return (
    <div>
      <h1>{name}님의 채팅방</h1>
      <ul>
        {messages.map((message) => (
          <li key={message.timestamp}>
            {message.name}:{message.text}
            <span>({new Date(message.timestamp).toLocaleString()})</span>
          </li>
        ))}
      </ul>
      <form onSubmit={handleMessageSubmit}>
        <label>
          <input
            type="text"
            placeholder="Message"
            value={message}
            onChange={handleMessageChange}
          />
        </label>
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatRoom;
