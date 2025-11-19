import { useState, createContext } from "react";

export const StoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
    const [loginStatus, setLoginStatus] = useState(false);
    const [userId, setUserId] = useState(null);
    return (
        <StoreContext.Provider value={{ loginStatus, setLoginStatus, userId, setUserId }}>
            {children}
        </StoreContext.Provider>
    );
};