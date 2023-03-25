import { useState, useEffect } from "react";
import { getDatabase, ref, push, set, onValue } from "firebase/database";
import { app } from "../firebase";

interface Message {
  name: string;
  text: string;
  createdAt: Date;
}

function ChatRoom({ name }: { name: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const db = getDatabase(app);
  const messagesRef = ref(db, `users/${name}/room/messages`);

  useEffect(() => {
    const messagesListener = onValue(messagesRef, (snapshot) => {
      const messagesData = snapshot.val();
      if (messagesData) {
        const messagesList: Message[] = Object.keys(messagesData).map(
          (key) => ({
            name: messagesData[key].name,
            text: messagesData[key].text,
            createdAt: new Date(messagesData[key].createdAt),
          })
        );
        setMessages(messagesList);
      }
    });
  }, [name]);

  async function handleMessageSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const messageData = {
      name,
      text: newMessage,
      createdAt: new Date(),
    };
    await push(messagesRef, messageData);

    console.log(messageData);

    console.log(typeof name);

    setNewMessage("");
  }

  return (
    <div>
      <div>
        {messages.map((message, index) => (
          <div key={index}>
            <span>{message.name}: </span>
            <span>{message.text}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handleMessageSubmit}>
        <label>
          <input
            type="text"
            placeholder="message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
        </label>
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ChatRoom;
