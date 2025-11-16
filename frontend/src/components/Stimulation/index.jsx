import "./index.css";
import PerformanceSum from "./PerformanceSum";

export default function Stimulation() {
  return (
    <div className="stimulation-container">
      <header>
        <div>
          <h1>Monte Carlo Stimulation</h1>
          <p className="stimulation-description">
            Monte carlo simulation for portfolio
          </p>
        </div>
        <select name="portfolio" id="portfolio">
          <option value="">-- Select Portfolio --</option>
          <option value="portfolio1">Portfolio 1</option>
          <option value="portfolio2">Portfolio 2</option>
          <option value="portfolio3">Portfolio 3</option>
        </select>
      </header>
      <PerformanceSum />
    </div>
  );
}
