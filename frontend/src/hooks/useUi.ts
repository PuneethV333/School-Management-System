import { useContext } from "react";
import { UIContext } from "../context/UiContext";

const useUi = () => {
    const context = useContext(UIContext)
    
    if(!context){
        throw new Error("useUI must be inside provider")
    }

    return context;
}

export default useUi;