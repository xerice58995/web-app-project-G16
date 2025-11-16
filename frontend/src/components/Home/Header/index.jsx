import "./index.css";

export default function HomeHeader({toggleLoginModal}) {
  return (
    <header className="home-header">
      <h1 style={{padding:"15px"}}>NTU Investment</h1>
      <button className="login-btn" onClick={toggleLoginModal}>Log In</button>
    </header>
  );
}
