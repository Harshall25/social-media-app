import { createContext } from "react";
import { useState } from "react";

export const GlobalContext = createContext();

export function GLobalContextState({children}){
    const [landing , setLanding] = useState(false);
    return (
        <GlobalContext.Provider value ={{landing,setLanding }}>
            {children}
        </GlobalContext.Provider>
    )
}