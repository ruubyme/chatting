import { useState } from "react";
import { getDatabase, ref, set } from "firebase/database";

function App() {
  const [name, setName] = useState<string>("");

  function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setName(event.target.value);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const db = getDatabase();
    await set(ref(db, `users/${name}`), {
      name,
    });
    setName("");
    console.log("정상적으로 등록되었습니다.");
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" value={name} onChange={handleNameChange} />
      </label>
      <button type="submit">확인</button>
    </form>
  );
}

export default App;
