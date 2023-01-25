import WidgetPanel from "./Components/WidgetPanel";
import { useContext, useEffect } from "react";
import { Context } from "./Context/MyContext";
import { Chat } from "./Context/ChatContext";
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
    arrayUnion,
    limit,
    orderBy
} from "firebase/firestore";
import { db } from "./Firebase.js";
import { signInAnonymously, updateProfile } from "firebase/auth";
import { auth } from "./Firebase.js";

function App() {
    const myContext = useContext(Context);
    const ChatContext = useContext(Chat);
    const params = new URLSearchParams(window.location.search)

    async function loginHandler(visitorId , websiteId) {

        let displayName;
        if (visitorId !== null) {
            displayName = visitorId.toString()
            await signInAnonymously(auth)
                .then(async (res) => {

                    updateProfile(res.user, {
                        displayName: displayName,
                    });

                    const userData = await getDoc(doc(db, "Users", res.user.uid))
                    if(!userData.exists()){
                        setDoc(doc(db, "Users", res.user.uid), {
                            displayName: displayName,
                            uid: res.user.uid,
                            websiteId: websiteId
                        });
                    }
                
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
                            where("websiteId", "==", websiteId),
                            orderBy("time"),
                            limit(1)
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
                            const checkInbox = await getDoc(doc(db, "Chats", inboxId));
                            if (!checkInbox.exists()) {
                                await setDoc(doc(db, "Chats", inboxId), { messages: [] });
                            }

                            const checkUserInfo = await getDoc(doc(db, "inbox", userId));
                            if (!checkUserInfo.exists()) {
                                await setDoc(doc(db, "inbox", userId), {});
                                await updateDoc(doc(db, "inbox", userId), {
                                    [inboxId + ".userInfo"]: {
                                        userId: adminId,
                                        displayName: adminName,
                                    },
                                    [inboxId + ".date"]: serverTimestamp(),
                                });
                            }
                            // const check = await getDoc(doc(db, "inbox" , adminId))
                            // // console.log(check.exists)
                            var data = false
                            await getDocs(query(collection(db, "inbox"), where("inboxArray.inboxId", "array-contains", inboxId))).then((res) => {
                                res.forEach((key) => {
                                    data = true
                                })
                            })

                            const check = await getDoc(doc(db, "inbox", adminId))
                            if (check.exists()) {
                                if (!data) {
                                    await updateDoc(doc(db, "inbox", adminId), {
                                        inboxArray: arrayUnion({inboxId:inboxId , websiteId: websiteId}),
                                        [inboxId + ".lastMessage"]: "Tap here to Start the chat",
                                        [inboxId + ".userName"]: userName,
                                        [inboxId + ".userInfo"]: {
                                            userId: userId,
                                            displayName: userName,
                                        },
                                        [inboxId + ".date"]: serverTimestamp(),
                                    });
                                }
                            } else {
                                await setDoc(doc(db, "inbox", adminId), {});
                                // this will update doc
                                await updateDoc(doc(db, "inbox", adminId), {
                                    inboxArray: arrayUnion({inboxId:inboxId , websiteId: websiteId}),
                                    [inboxId + ".lastMessage"]: "Tap here to Start the chat",
                                    [inboxId + ".userName"]: userName,
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
                    ChatContext.getUser(userId, adminId, displayName); // Sending info into context
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    useEffect(() => {
        loginHandler(params.get("visitorId") , params.get("websiteId"))
    }, [params.get("visitorId")])
    return (
        <>
            {
                myContext.user !== null && (<WidgetPanel />)
            }
        </>
    )
}

export default App;
