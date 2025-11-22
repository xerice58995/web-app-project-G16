import "./index.css";
import adImage from "./ad.png";
import { useState, useContext } from "react";
import { StoreContext } from "../../Utils/Context";

export default function FloatingAd() {
  const [isVisible, setIsVisible] = useState(true);
  const { userInfo, setUserInfo } = useContext(StoreContext);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      setIsVisible(true);
    }, 3000);
  };

  if (!isVisible || userInfo.loginStatus) return null;

  return (
    <div className="floating-ad">
      <button className="close-ad-btn" onClick={handleClose}>X</button>

      <img
        src={adImage}
        alt="Advertisement"
        className="ad-image"
      />
    </div>
  );
}
