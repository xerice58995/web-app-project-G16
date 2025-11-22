import { useState, useContext } from "react";
import { StoreContext } from "../Utils/Context";
import api from "../api";
import "./index.css";
import UseNotify from "../Utils/UseNotify";
import { User, Lock, Loader2, X } from "lucide-react";

export default function Login({ onClose, initialMode = "login" }) {
  const [isSignup, setIsSignup] = useState(initialMode === "signup");
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const { setUserInfo } = useContext(StoreContext);
  const notify = UseNotify();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const path = isSignup ? "/users/signup" : "/users/login";

    try {
      const res = await api.post(path, formData);
      const response = res.data;

      if (response.code === 0) {
        notify(response.message, "error");
      } else {
        const { userId, userName } = response.data || {};

        setUserInfo({
          loginStatus: true,
          userId,
          userName,
        });

        localStorage.setItem("loginStatus", "true");
        localStorage.setItem("userId", userId);
        localStorage.setItem("userName", userName);

        notify(response.message, "success");
        onClose();
        setFormData({ username: "", password: "" });
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
    <div className="login-wrapper">
      <div className={`glass-card ${isSignup ? "expanded" : ""}`}>
        
        <button onClick={onClose} className="close-btn" aria-label="Close">
          <X size={20} />
        </button>

        <div className="card-content">
          
          <div className="form-section">
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

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <label className="input-label">Username</label>
                <input
                  className="form-input"
                  name="username"
                  type="text"
                  placeholder="Enter your Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
                <User size={18} className="input-icon" />
              </div>

              <div className="input-group">
                <label className="input-label">Password</label>
                <input
                  className="form-input"
                  name="password"
                  type="password"
                  placeholder="Enter your Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <Lock size={18} className="input-icon" />
              </div>

              <button
                type="submit"
                className="login-btn"
                disabled={!formData.username || !formData.password || loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Processing...
                  </>
                ) : isSignup ? (
                  "Create Account"
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          </div>

          <div className={`premium-section ${isSignup ? "show" : ""}`}>
            <h3>Most Powerful and Reliable Financial Platform</h3>
            <p>Sign up now to unlock professional features:</p>
            <ul>
              <li>• Zero Ads</li>
              <li>• Customized Portfolio</li>
              <li>• Comprehensive Financial Analysis</li>
              <li>• Priority Access to New Features</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
