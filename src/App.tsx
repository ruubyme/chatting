import { useState } from "react";
import { get, getDatabase, ref, set } from "firebase/database";
import { app } from "./firebase";
import ChatRoom from "./components/ChatRoom";

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
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={handleNameChange} />
        </label>
        <button type="submit">확인</button>
      </form>
    );
  } else if (page === "chat") {
    return <ChatRoom name={name} />;
  }
}

export default App;
