import { useState, useContext } from "react";
import { StoreContext } from "../Utils/Context";
import api from "../api";
import "./index.css";
import UseNotify from "../Utils/UseNotify";


export default function Login({ onClose }) {
  const [activePanel, setActivePanel] = useState("login");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const isLoginValid = loginUsername && loginPassword;
  const isSignupValid = signupUsername && signupPassword;

  const [infoText, setInfoText] = useState("");
  const { setLoginStatus, setUserId } = useContext(StoreContext);

  const clearInputs = () => {
    setLoginUsername("");
    setLoginPassword("");
    setSignupUsername("");
    setSignupPassword("");
  };

  const notify = UseNotify();

  const handleLoginOrSignUp = async (flag) => {
    const path = flag === "signup" ? "/users/signup" : "/users/login";
    try {
      const res = await api.post(path, {
        username: flag === "signup" ? signupUsername : loginUsername,
        password: flag === "signup" ? signupPassword : loginPassword,
      });
      const response = res.data;
      if (response.code === 0) {
        setInfoText(response.message);
      } else {
        setUserId(response.data?.userId);
        setLoginStatus(true);
        onClose();
        clearInputs();
        notify(response.message, "success");
      }
    } catch (err) {
      setInfoText(err.response?.data?.message || err.message);
    }
  };
  return (
    <div className="login">
      {/* Tabs */}
      <ul className="tabs">
        <li
          className={activePanel === "login" ? "active" : ""}
          onClick={() => {
            setActivePanel("login");
          }}
        >
          Log In
        </li>
        <li
          className={activePanel === "signup" ? "active" : ""}
          onClick={() => setActivePanel("signup")}
        >
          Sign Up
        </li>
      </ul>

      <div className="tab-content">
        {activePanel === "login" && (
          <div className="panel">
            <strong>Username</strong>
            <input
              type="text"
              placeholder="Enter your Username"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
            />
            <strong>Password</strong>
            <input
              type="password"
              placeholder="Enter your Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            <button
              className="login-btn"
              disabled={!isLoginValid}
              onClick={() => handleLoginOrSignUp("login")}
            >
              Log In
            </button>
          </div>
        )}

        {activePanel === "signup" && (
          <div className="panel">
            <strong>Username</strong>
            <input
              type="text"
              placeholder="Enter your Username"
              value={signupUsername}
              onChange={(e) => setSignupUsername(e.target.value)}
            />
            <strong>Password</strong>
            <input
              type="password"
              placeholder="Enter your Password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
            />
            <button
              className="login-btn"
              disabled={!isSignupValid}
              onClick={() => handleLoginOrSignUp("signup")}
            >
              Sign Up
            </button>
          </div>
        )}
        <p>{infoText}</p>
      </div>
    </div>
  );
}
