import { useEffect, useState } from "react";
import Container from "./Container";
import { useContext } from "react";
import { Chat } from "../Context/ChatContext";

export default function ChatBox({ messages, id }) {
  const { currentUserId } = useContext(Chat);

  const [side, setSide] = useState(false);

  useEffect(() => {
    if (id === currentUserId) {
      setSide(true);
    } else {
      setSide(false);
    }
  }, [currentUserId]);

  return side ? (
    <Container>
      <div className="w-full h-auto my-3">
        <div className="max-w-[60vw] max-h-[80vh] bg-[#3930d8] inline-block text-white p-3 px-6 rounded-3xl float-right mr-4">
          <div className="text-justify h-auto text-md">{messages}</div>
        </div>
        <div className="clear-both"></div>
      </div>
    </Container>
  ) : (
    <Container>
      <div className="w-full h-auto my-3">
        <div className="max-w-[60vw] max-h-[80vh] bg-[#ebf4fb] inline-block text-black p-3 px-6 rounded-3xl ml-4">
          <div className="text-justify text-md">{messages}</div>
        </div>
      </div>
    </Container>
  );
}
