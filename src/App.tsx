import { useState } from "react";
import { get, getDatabase, ref, set } from "firebase/database";
import { app } from "./firebase";
import ChatRoom from "./components/ChatRoom";
import styled, { createGlobalStyle } from "styled-components";

//style

const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Name = styled.h1`
  font-size: 20px;
  width: 100px;
`;

const Input = styled.input`
  padding: 8px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
  margin-bottom: 16px;
  width: 200px;
`;

const Button = styled.button`
  padding: 8px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background-color: #fff;
  cursor: pointer;

  &:hover {
    background-color: #ccc;
  }
`;

//

interface User {
  name: string;
}

function App() {
  const [name, setName] = useState<string>("");
  const [page, setPage] = useState<string>("form");

  function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setName(event.target.value);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const db = getDatabase(app);
    await set(ref(db, `users/${name}`), {
      name,
    });
    //setName("");
    setPage("chat"); //page state를 chat으로 업데이트
    console.log("정상적으로 등록되었습니다.");
  }
  if (page === "form") {
    return (
      <AppContainer>
        <FormContainer onSubmit={handleSubmit}>
          <label>
            <Name>Name</Name>
            <Input type="text" value={name} onChange={handleNameChange} />
          </label>
          <Button type="submit">확인</Button>
        </FormContainer>
      </AppContainer>
    );
  } else if (page === "chat") {
    return <ChatRoom name={name} />;
  }
}

export default App;
