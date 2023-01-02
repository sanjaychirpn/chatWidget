import Container from "./Container";
import { AiOutlineSend } from "react-icons/ai";
import React, { useEffect, useState } from "react";
import { db } from "../Firebase";
import {
  updateDoc,
  doc,
  arrayUnion,
  Timestamp,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { useContext } from "react";
import { Chat } from "../Context/ChatContext";
import { v4 as uuid } from "uuid";
import ChatBox from "./ChatBox";

export default function WidgetPanel(props) {
  const { adminId, currentUserId, inboxId , userName } = useContext(Chat);
  const [text, setText] = useState("");
  const [inbox, setInbox] = useState("");
  const [chats, setChats] = useState([]);
  const [print, setPrint] = useState([]);

  async function sendMessage(event) {
    event.preventDefault();
    const admin = await adminId;
    const currentUser = currentUserId;
    const inbox = inboxId;
    const user = userName
    await updateDoc(doc(db, "Chats", inbox), {
      messages: arrayUnion({
        id: uuid(),
        text,
        senderId: currentUser,
        date: Timestamp.now(),
      }),
    });

    await updateDoc(doc(db, "inbox", currentUser), {
      [inbox + ".lastMessage"]: text,
      [inbox + ".senderId"]: currentUser,
      [inbox + ".userInfo"]: {
        userId: admin
      },
      [inbox + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "inbox", admin), {
      [inbox + ".lastMessage"]: text,
      [inbox + ".senderId"]: currentUser,
      [inbox + ".userInfo"]: {
        userId: currentUser
      },
      [inbox + ".date"]: serverTimestamp(),
    });
    setText("");
  }

  useEffect(() => {
    async function getChats() {
      onSnapshot(doc(db, "Chats", inboxId), (doc) => {
        if (doc.exists()) {
          let array = [];
          doc.data().messages.forEach((res) => {
            const data = {
              text: res.text,
              id: res.senderId,
              uid: res.id,
            };
            array.push(data);
          });
          setPrint(array);
        }
      });
    }
    if (inboxId) {
      getChats();
    }
  }, [chats, inboxId]);

  return (
    <>
      <div
        className={`shadow-2xl bottom-28 right-16 w-full h-full  duration-700 overflow-hidden`}
      >
        <Container>
          <div className="h-[10vh] flex bg-gradient-to-r from-[#0057FF] to-[#0057FF] pl-5 pt-5 rounded-b-none text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className=" mr-3 w-6 h-6 cursor-pointer text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
            <img
              className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
              src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt=""
            />
            <img
              className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
              src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt=""
            />
            <img
              className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
              alt=""
            />
            <div>
              <span className="text-white pl-10 font-bold">Aye Analytics</span>
            </div>
          </div>
        </Container>
        <Container className="bg-white rounded-b-none">
          <div className="min-h-full h-[80vh] overflow-y-auto py-2">
            {print.map((chat) => {
              return (
                <ChatBox key={chat.uid} messages={chat.text} id={chat.id} />
              );
            })}
          </div>
        </Container>
        <form
          onSubmit={sendMessage}
          className="h-[10vh] bg-white flex items-center border-t-[0.4vh] justify-center rounded-b-2xl"
        >
          <input
            className=" w-[81%] outline-none border-2 border-gray rounded-xl p-2 h-10"
            type="text"
            name="chat"
            placeholder="Start a Conversation"
            maxLength={150}
            value={text}
            onChange={(e) => {  
              setText(e.target.value);
            }}
            required
          />
          <div className=" rounded-full"></div>
          <button
            className="bg-gradient-to-r m-6 from-[#0052F1] to-[#003BAF] text-white p-3 rounded-full flex items-center justify-around text-xl"
            type="submit"
          >
            <AiOutlineSend />
          </button>
        </form>
      </div>
    </>
  );
}
