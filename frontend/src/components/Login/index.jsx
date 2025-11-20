import { useState, useContext } from "react";
import { StoreContext } from "../Utils/Context";
import api from "../api";
import "./index.css";
import UseNotify from "../Utils/UseNotify";

export default function Login({ onClose }) {
  const [isSignup, setIsSignup] = useState(false);

  const [formData, setFormData] = useState({ username: "", password: "" });

  const [loading, setLoading] = useState(false);

  const { setUserInfo } = useContext(StoreContext);
  const notify = UseNotify();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    setLoading(true);

    const path = isSignup ? "/users/signup" : "/users/login";

    try {
      const res = await api.post(path, formData);
      const response = res.data;

      if (response.code === 0) {
        notify(response.message, "error");
      } else {
        // Success Logic
        const { userId, userName } = response.data || {};

        setUserInfo({
          loginStatus: true,
          userId,
          userName,
        });

        localStorage.setItem("loginStatus", "true");
        localStorage.setItem("userId", userId); // Ensure userId is a string or number
        localStorage.setItem("userName", userName);

        notify(response.message, "success");
        onClose();
        setFormData({ username: "", password: "" }); // Clear inputs
      }
    } catch (err) {
      notify(err.response?.data?.message || err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = (signupMode) => {
    setIsSignup(signupMode);
    setFormData({ username: "", password: "" });
  };

  return (
    <div className="login">
      <ul className="tabs">
        <li
          className={!isSignup ? "active" : ""}
          onClick={() => toggleMode(false)}
        >
          Log In
        </li>
        <li
          className={isSignup ? "active" : ""}
          onClick={() => toggleMode(true)}
        >
          Sign Up
        </li>
      </ul>

      <div className="tab-content">
        <form className="login-form" onSubmit={handleSubmit}>
          <strong>Username</strong>
          <input
            name="username"
            type="text"
            placeholder="Enter your Username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
          <strong>Password</strong>
          <input
            name="password"
            type="password"
            placeholder="Enter your Password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <button
            type="submit"
            className="login-btn"
            disabled={!formData.username || !formData.password || loading}
          >
            {loading ? "Processing..." : isSignup ? "Sign Up" : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}
