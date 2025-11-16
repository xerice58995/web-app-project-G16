import { useState } from "react";
import "./index.css";

export default function Login() {
  const [activePanel, setActivePanel] = useState("login");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const isLoginValid = loginUsername && loginPassword;
  const isSignupValid = signupUsername && signupPassword;

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
            <button className="login-btn" disabled={!isLoginValid}>Log In</button>
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
            <button className="login-btn" disabled={!isSignupValid}>Sign Up</button>
          </div>
        )}
      </div>
    </div>
  );
}
