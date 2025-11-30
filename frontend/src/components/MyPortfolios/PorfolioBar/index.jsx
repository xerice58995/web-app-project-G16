import "./index.css";
import { useState} from "react";
import PortfolioAllocationPieChart from "../PortfolioAllocationPieChart";
import PorfolioLineChart from "../PortfolioLineChart";
import { ChevronsUpDown } from "lucide-react";
import PortfolioTable from "../PortfolioTable";

export default function PortfolioBar({ portfolioData }) {
  // Calculate total value here to pass down if needed, or keep in child
  const assets = portfolioData.assets;
  const [expand, setExpand] = useState(false);
  const totalValue = assets.reduce(
    (acc, curr) => acc + curr.price * curr.quantity,
    0
  );

  return (
    <div className="portfolio-card">
      {/* --- Top Section: Header, Table, Pie Chart --- */}
      <div className="portfolio-top-section">
        <PortfolioTable portfolioData={portfolioData} totalValue={totalValue} />
        <div className="chart-wrapper">
          <h5 className="section-label">Allocation</h5>
          <PortfolioAllocationPieChart data={portfolioData.assets} />
        </div>
      </div>

      <button
        className={`expand-button ${expand ? "expanded" : ""}`}
        onClick={() => setExpand(!expand)}
        aria-label={expand ? "Collapse details" : "Expand details"}
      >
        <ChevronsUpDown size={20} />
      </button>

      {/* --- Bottom Section: Line Chart --- */}
      <div className={`portfolio-bottom-section ${expand ? "" : "inactive"}`}>
        <div className="section-divider"></div>
        <h5 className="section-label">Performance History</h5>
        <div className="history-chart-container">
          <PorfolioLineChart
            portfolioId={portfolioData.portfolioId}
            portfolioName={portfolioData.name}
            expanded={expand}
          />
        </div>
      </div>
    </div>
  );
}
