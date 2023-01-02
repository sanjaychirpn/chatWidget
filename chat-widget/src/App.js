import WidgetPanel from "./Components/WidgetPanel";
import AnonymousLogin from "./Components/AnonymousLogin";
import { useContext } from "react";
import { Context } from "./Context/MyContext";

function App() {
  const myContext = useContext(Context);

  return (
    <>
    {
    myContext.user !== null 
    ? 
      (<WidgetPanel />) 
    : 
      (<AnonymousLogin />)
    }
    </>
  )
}

export default App;
