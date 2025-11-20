import "./index.css";
import { useContext } from "react";
import { StoreContext } from "../../Utils/Context";

export default function PremiumLabel() {
  const { userInfo } = useContext(StoreContext);
  if (userInfo.loginStatus) return null;
  return (
    <div className="premium-label">
      Log in for premium feature!
      <div
        style={{
          position: "absolute",
          top: "50%",
          right: "-6px",
          marginTop: "-6px",
          borderTop: "6px solid transparent",
          borderBottom: "6px solid transparent",
          borderLeft: "6px solid #6e56cf",
        }}
      ></div>
    </div>
  );
}
