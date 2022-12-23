import { useState } from "react";
import { BsCloudArrowUp } from "react-icons/bs";
import { BsCloudArrowDown } from "react-icons/bs";
import AnonymousLogin from "./AnonymousLogin";
import { useContext } from "react";
import { Context } from "../Context/MyContext";
import WidgetPanel from "./WidgetPanel";

export default function WidgetButton() {
  const [show, setShow] = useState(false);
  const myContext = useContext(Context);
  return (
    <>
      <div
        onClick={() => setShow(!show)}
        className="cursor-pointer fixed z-20 bottom-10 right-10 p-3 rounded-full bg-gradient-to-r from-[#0052F1] to-[#003BAF]"
      >
        {show === false ? (
          <BsCloudArrowUp className="text-white" size={30} />
        ) : (
          <BsCloudArrowDown className="text-white" size={30} />
        )}
      </div>
      {myContext.user !== null ? (
        <WidgetPanel />
      ) : (
        <AnonymousLogin
          className={`${show === false ? "opacity-0" : "opacity-100"}`}
        />
      )}
    </>
  );
}
