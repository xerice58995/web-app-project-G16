import { Routes, Route, Navigate} from "react-router-dom";
import Home from "./components/Home/index.jsx";

export default function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home/*" element={<Home />} />
      </Routes>
    </div>
  );
}
