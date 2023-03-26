import { useState, useEffect, useRef } from "react";
import { getDatabase, onValue, push, ref, set, off } from "firebase/database";
import { app } from "../firebase";
import styled, { createGlobalStyle } from "styled-components";

//style

const ChatRoomContainer = styled.div`
  max-width: 500px;
  padding: 20px;
  background-color: #45484d;
  height: 80vh;
  border-radius: 5%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
`;

const UserName = styled.h1`
  font-weight: bold;
  font-size: 20px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #9ac9ff;
`;

const ChatTitle = styled.h1`
  font-weight: bold;
  font-size: 20px;
  color: #ffffff;
  padding-left: 5px;
`;

const ChatName = styled.div`
  font-weight: bold;
  margin-right: 8px;
`;

const ChatItem = styled.li<{ isMe?: boolean }>`
  list-style: none;
  margin-bottom: 8px;
  display: flex;
  flex-direction: ${({ isMe }) => (isMe ? "row-reverse" : "row")};

  & > div {
    padding: 8px;
    border-radius: 8px;
    background-color: ${({ isMe }) => (isMe ? "#9ac9ff" : "#e6e6e6")};
    color: ${({ isMe }) => (isMe ? "#fff" : "#000")};
    max-width: 60%;
    word-wrap: break-word;
    margin: 1px;
  }

  & > div + span {
    margin-left: ${({ isMe }) => (isMe ? "0" : "8px")};
    margin-right: ${({ isMe }) => (isMe ? "8px" : "0")};
    align-self: flex-end;
  }
`;

const ChatText = styled.div`
  padding: 8px;
  border-radius: 8px;
  background-color: #d9d9d9;
  color: black;
`;

const ChatTime = styled.span`
  font-size: 12px;
  color: #aaa;
  display: block;
`;

const ChatList = styled.ul`
  height: 650px;
  list-style: none;
  padding: 0;
`;

const ChatInputWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const ChatInput = styled.input`
  width: 300px;
  padding: 8px;
  border-radius: 8px;
  border: none;
  margin-right: 8px;
`;

const ChatButton = styled.button`
  width: 20%;
  padding: 8px;
  border-radius: 8px;
  border: none;
  background-color: #9ac9ff;
  color: #fff;
`;

//

type ChatRoom = {
  id: string;
  messages: Message[];
};

type Message = {
  name: string;
  text: string;
  timestamp: number;
  isMe?: boolean;
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
      isMe: false,
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
        const messagesData: Message[] = Object.values<Message>(data).map(
          (message: Message) => ({
            ...message,
            isMe: message.name === name,
          })
        );
        setMessages(messagesData);
      }
    });
    return () => off(messagesRef);
  }, []);

  return (
    <ChatRoomContainer>
      <ChatHeader>
        <UserName>{name}</UserName>
        <ChatTitle> 's chat room</ChatTitle>
      </ChatHeader>
      <ChatList>
        {messages.map((message) => (
          <ChatItem isMe={message.isMe} key={message.timestamp}>
            <ChatName>{message.name}</ChatName>
            <ChatText>{message.text}</ChatText>
            <ChatTime>
              ({new Date(message.timestamp).toLocaleString()})
            </ChatTime>
          </ChatItem>
        ))}
      </ChatList>
      <form onSubmit={handleMessageSubmit}>
        <ChatInputWrapper>
          <label>
            <ChatInput
              type="text"
              placeholder="Message"
              value={message}
              onChange={handleMessageChange}
            />
          </label>
          <ChatButton type="submit">Send</ChatButton>
        </ChatInputWrapper>
      </form>
    </ChatRoomContainer>
  );
};

export default ChatRoom;
