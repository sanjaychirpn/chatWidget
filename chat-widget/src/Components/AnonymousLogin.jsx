import Container from "./Container";
import React from "react";
import { signInAnonymously, updateProfile } from "firebase/auth";
import { auth } from "../Firebase.js";
import { FcElectroDevices } from "react-icons/fc";
// Importing contexts
import { useContext } from "react";
import { Chat } from "../Context/ChatContext";
import { Context } from "../Context/MyContext";
// Importing contexts
import {
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  query,
  doc,
  collection,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../Firebase.js";

export default function AnonymousLogin(props) {
  const myContext = useContext(Context);
  const ChatContext = useContext(Chat);

  async function loginHandler(event) {
    event.preventDefault();
    const displayName = event.target.user.value;
    // CREATING A ANONYMOUS USER
    await signInAnonymously(auth)
      .then(async (res) => {
        console.log(res)
        updateProfile(res.user, {
          displayName: displayName,
        });
        
        setDoc(doc(db, "Users", res.user.uid), {
          displayName: displayName,
          uid: res.user.uid,
          websiteURL: "http://localhost:3000",
          websiteId: "frontend_team",
        });
        // CREATING A ANONYMOUS USER
        myContext.getUser(res.user.uid); // Sending info into context

        // FINDING OR CREATING A CHAT INBOX
        let userId = res.user.uid;
        let userName = displayName;

        // GET ADMIN ID AND NAME
        let adminId, adminName;
        await getDocs(
          query(
            collection(db, "Admins"),
            where("websiteId", "==", "frontend_team")
          )
        ).then((res) => {
            res.forEach((admin) => {
              adminId = admin.data().uid;
              adminName = admin.data().displayName;
            });
          })
          .catch((error) => {
            console.log(error);
          });
        // GET ADMIN ID AND NAME
        
        if (userId !== null && adminId !== null) {
          const inboxId = adminId + userId;
          try {
            // check if doc exists or not
            const checkInbox = await getDoc(doc(db, "Chats", inboxId));
            if (!checkInbox.exists()) {
              // new doc created
              await setDoc(doc(db, "Chats", inboxId), { messages: [] });
            }

            // Checking if doc exists or not
            const checkUserInfo = await getDoc(doc(db, "inbox", userId));
            if (!checkUserInfo.exists()) {
              // if doc doesnt exists this will make one
              await setDoc(doc(db, "inbox", userId), {});
              // this will update doc
              await updateDoc(doc(db, "inbox", userId), {
                [inboxId + ".userInfo"]: {
                  userId: adminId,
                  displayName: adminName,
                },
                [inboxId + ".date"]: serverTimestamp(),
              });
            }
            // Checking if doc exists or not
            const check = await getDoc(doc(db, "inbox", adminId));

            if (!check.exists()) {
              // if doc doesnt exists this will make one
              await setDoc(doc(db, "inbox", adminId), {});
              // this will update doc
              await updateDoc(doc(db, "inbox", adminId), {
                [inboxId + ".lastMessage"]: "Tap here to Start the chat",
                [inboxId + ".userInfo"]: {
                  userId: userId,
                  displayName: userName,
                },
                [inboxId + ".date"]: serverTimestamp(),
              });
            }
          } catch (error) {
            console.log("something went wrong");
          }
        }
        // FINDING OR CREATING A CHAT INBOX
        ChatContext.getUser(userId, adminId , displayName); // Sending info into context
      })
      .catch((error) => {
        console.log(error);
      });
  }
  return (
    <>
      <div
        className={` bg-slate-100 bottom-36 shadow-2xl rounded-t-none right-16 w-full h-full duration-700`}
      >
        <Container>
          <div className="h-[40vh] shadow-inner  rounded-b-none text-center bg-gradient-to-r from-[#0052F1] to-[#003BAF] ">
            <div>
              <div className="flex justify-between pr-4 overflow-hidden">
                <div className="text-5xl shadow-2xls pb-0 p-3 ">
                  <FcElectroDevices />
                </div>
                <div className="p-3 pb-0">
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
                </div>
              </div>
              <div className="mt-1 pr-4 text-right text-xs font-medium">
                <a href="/" className="text-white">
                  + 150 others
                </a>
              </div>
            </div>
            <div className="font-bold font-[jatin34]  text-white text-2xl">
              <div>Hello There :)</div>
            </div>
            <div className="font-bold   font-[jatin34]  text-white text-2xl">
              How can we help?
            </div>
          </div>
        </Container>
        <Container>
          <form
            onSubmit={loginHandler}
            className="h-[35vh] shadow-2xl bg-[#F5F5F5] rounded-2xl absolute left-[20%] top-[32%] w-[60vw] drop-shadow-2xl  rounded-b-none py-2"
          >
            <div className="m-2 text-center ">
              <p className="font-bold text-lg font-[ubantu] p-5 pb-0">
                Send us a message
              </p>
              <p className="font-serif text-[15px]  p-5 pt-0">
                We will reply you as soon as possible
              </p>
            </div>
            <div className="w-full border-[0.4vh] mt-5 flex justify-between m-auto">
              <input
                name="user"
                type="text"
                className="form-control bg-slate-100 outline-none   block w-[80%] ml-4  px-3 py-1.5 text-base font-normal text-gray-700"
                id="exampleFormControlInput5"
                placeholder="Enter Your Name..."
              />
              <button
                type="submit"
                className="  px-3 py-1  text-blue-600 font-medium text-xs rounded-full "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                  />
                </svg>
              </button>
            </div>
          </form>
        </Container>
        <Container>
          <div className=" h-[40vh] shadow-inner  w-full mt-[20vh] bg-gradient-to-r from-[#0052F1] to-[#003BAF]"></div>
        </Container>
      </div>
    </>
  );
}
