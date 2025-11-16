import "./index.css";
import { Link } from "react-router-dom";
import { ChartCandlestick, CircleDollarSign, Settings, TrendingUpDown } from "lucide-react";

export default function NavBar() {
  return (
    <nav className="nav-bar">
      <ul>
        <li className="home-nav-link">
          <Link to="/home/stock-market">
            <ChartCandlestick /> Stock Market
          </Link>
        </li>
        <li className="home-nav-link">
          <Link to="/home/portfolio">
            <CircleDollarSign />
            My Portfolio
          </Link>
        </li>
        <li className="home-nav-link">
          <Link to="/home/stimulation">
            <TrendingUpDown />
            Stimulation
          </Link>
        </li>
        <li className="home-nav-link">
          <Link to="/home/settings">
            <Settings />
            Settings
          </Link>
        </li>
      </ul>
    </nav>
  );
}
