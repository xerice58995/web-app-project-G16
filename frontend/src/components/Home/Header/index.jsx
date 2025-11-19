import "./index.css";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../Utils/Context";

export default function HomeHeader({ toggleLoginModal }) {
  const navigate = useNavigate();
  const { loginStatus, setLoginStatus, setUserId } = useContext(StoreContext);
  const logout = () => {
    setUserId(null);
    setLoginStatus(false);
    navigate("/");
  };
  return (
    <header className="home-header">
      <h1 style={{ padding: "15px" }}>NTU Investment</h1>
      <button
        className="login-btn"
        style={{ backgroundColor: loginStatus ? "red" : "" }}
        onClick={!loginStatus ? toggleLoginModal : logout}
      >
        {loginStatus ? "Log Out" : "Log In"}
      </button>
    </header>
  );
}
