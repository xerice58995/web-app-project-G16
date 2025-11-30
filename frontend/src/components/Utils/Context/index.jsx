import { useState, createContext, useCallback, useEffect } from "react";

export const StoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(() => ({
    loginStatus: localStorage.getItem("loginStatus") === "true",
    userId: localStorage.getItem("userId"),
    userName: localStorage.getItem("userName") || "",
  }));

  const [refreshTrigger, setRefreshTrigger] = useState(() => ({
    portfolioRefreshTrigger: 0,
  }));

  useEffect(() => {
    localStorage.setItem("loginStatus", userInfo.loginStatus);
    localStorage.setItem("userId", userInfo.userId || "");
    localStorage.setItem("userName", userInfo.userName || "");
  }, [userInfo]);

  const triggerPortfolioRefresh = useCallback(() => {
    setRefreshTrigger((prev) => ({
      ...prev, // Keep other triggers if you add them later
      portfolioRefreshTrigger: prev.portfolioRefreshTrigger + 1,
    }));
  }, []);

  return (
    <StoreContext.Provider
      value={{
        userInfo,
        setUserInfo,
        triggerPortfolioRefresh,
        refreshTrigger,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
