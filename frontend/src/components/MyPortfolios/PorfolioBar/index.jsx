import "./index.css";
import { useState, useContext } from "react";
import PortfolioEdit from "../PortfolioEdit";
import PortfolioAllocationPieChart from "../PortfolioAllocationPieChart";
import Modal from "../../Modal";
import { StoreContext } from "../../Utils/Context";
import { handleResponse, handleError } from "../../Utils/Response";
import api from "../../api";
import UseNotify from "../../Utils/UseNotify";
import PorfolioLineChart from "../PortfolioLineChart";
import { ChevronsUpDown } from "lucide-react";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

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

function PortfolioTable({ portfolioData, totalValue }) {
  const assets = portfolioData.assets;
  const [showEditModal, setShowEditModal] = useState(false);
  const { triggerPortfolioRefresh } = useContext(StoreContext);
  const notify = UseNotify();

  const deletePortfolio = async () => {
    try {
      const response = await api.delete(
        `/portfolio/${portfolioData.portfolioId}`
      );
      triggerPortfolioRefresh();
      handleResponse(response, "Portfolio deleted successfully.", notify);
    } catch (error) {
      handleError(error, "Failed to delete portfolio.", notify);
    }
  };

  return (
    <div className="table-section">
      <header className="portfolio-header">
        <div>
          <h3 className="portfolio-title">{portfolioData.name}</h3>
          <span className="portfolio-subtitle">
            Total Value:{" "}
            <span className="value-highlight">
              {formatCurrency(totalValue)}
            </span>
          </span>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-secondary"
            onClick={() => setShowEditModal(true)}
          >
            Edit
          </button>
          <button className="btn btn-danger" onClick={deletePortfolio}>
            Delete
          </button>
        </div>
      </header>

      <div className="table-wrapper">
        <table className="modern-table">
          <thead>
            <tr>
              <th className="text-left">Ticker</th>
              <th className="text-right">Price</th>
              <th className="text-right">Shares</th>
              <th className="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset, index) => (
              <tr key={index}>
                <td className="fw-bold">{asset.ticker}</td>
                <td className="text-right">{formatCurrency(asset.price)}</td>
                <td className="text-right">
                  {asset.quantity.toLocaleString()}
                </td>
                <td className="text-right fw-bold">
                  {formatCurrency(asset.price * asset.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showEditModal && (
        <Modal onClose={() => setShowEditModal(false)}>
          <PortfolioEdit
            portfolioData={portfolioData}
            status={"edit"}
            onClose={() => setShowEditModal(false)}
          />
        </Modal>
      )}
    </div>
  );
}
