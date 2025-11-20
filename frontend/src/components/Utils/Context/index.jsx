import { useState, createContext, useEffect } from "react";

export const StoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(() => ({
    loginStatus: localStorage.getItem("loginStatus") === "true",
    userId: localStorage.getItem("userId"),
    userName: localStorage.getItem("userName") || "",
  }));
  return (
    <StoreContext.Provider
      value={{
        userInfo,
        setUserInfo,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
