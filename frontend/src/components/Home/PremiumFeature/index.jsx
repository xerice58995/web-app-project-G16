import "./index.css";
import { useContext, useState } from "react";
import { Crown } from "lucide-react";
import { StoreContext } from "../../Utils/Context";
import Login from "../../Login";

export default function PremiumLabel() {
  const { userInfo } = useContext(StoreContext);
  const [showLogin, setShowLogin] = useState(false);

  if (userInfo.loginStatus) return null;

  const handlePremiumClick = () => {
    setShowLogin(true);
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
  };

  return (
    <>
      <button className="premium-btn" onClick={handlePremiumClick}>
        <Crown size={16} className="crown-icon" />
        <span>Sign up for Premium</span>
      </button>

      {showLogin && (
        <Login onClose={handleCloseLogin} initialMode="signup" />
      )}
    </>
  );
}
