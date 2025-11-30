import UseNotify from "../../Utils/UseNotify";
import { useState, useContext, useEffect } from "react";
import PortfolioEdit from "../PortfolioEdit";
import Modal from "../../Modal";
import { StoreContext } from "../../Utils/Context";
import { handleResponse, handleError } from "../../Utils/Response";
import api from "../../api";
import "./index.css";
import StockAdviceDark from "../StockAdvice";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

export default function PortfolioTable({ portfolioData, totalValue }) {
  const { triggerPortfolioRefresh } = useContext(StoreContext);
  const [showEditModal, setShowEditModal] = useState(false);
  const [stockRecommendInfo, setStockRecommendInfo] = useState({});
  const [hoveredAsset, setHoveredAsset] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const notify = UseNotify();

  const deletePortfolio = async () => {
    if (!portfolioData) return;
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

  const handleMouseEnter = (e, asset) => {
    // Get the position of the ROW that was hovered
    const rect = e.currentTarget.getBoundingClientRect();

    setTooltipPosition({
      top: rect.top + rect.height / 2, // Center vertically relative to row
      left: rect.right + 15, // 15px gap to the right of the table
    });
    setHoveredAsset(asset);
  };

  const handleMouseLeave = () => {
    setHoveredAsset(null);
  };

  const stockRecommend = async () => {
    if (!portfolioData?.portfolioId) return;
    try {
      const response = await api.get(
        `/portfolio/recommendation/${portfolioData.portfolioId}`
      );
      //   console.log(response.data.data);
      const data = response.data.data.suggestions;
      const extractedData = {};
      data.forEach((item) => {
        extractedData[item.ticker] = {
          action: item.action,
          reason: item.reason,
        };
      });
      setStockRecommendInfo(extractedData);
    } catch (error) {
      console.error("Error fetching stock recommendations:", error);
    }
  };
  const assets = portfolioData.assets || [];
  useEffect(() => {
    if (portfolioData?.assets) {
      stockRecommend();
    }
  }, [portfolioData?.assets?.length]);

  if (!portfolioData || assets.length === 0) {
    return null;
  }

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
              <tr
                key={index}
                onMouseEnter={(e) => handleMouseEnter(e, asset)}
                onMouseLeave={handleMouseLeave}
              >
                <td className="fw-bold ticker-cell">
                  {asset.ticker}
                  {/* The Tooltip Component */}
                </td>
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
      {hoveredAsset && (
        <div
          style={{
            position: "fixed", // Fixed relative to SCREEN, ignores table scroll
            top: tooltipPosition.top,
            left: tooltipPosition.left,
            transform: "translateY(-50%)", // Center vertically exactly
            zIndex: 9999, // Ensure it sits on top of everything
            pointerEvents: "none", // Optional: makes it click-through
          }}
        >
          <StockAdviceDark
            ticker={hoveredAsset.ticker}
            action={stockRecommendInfo[hoveredAsset.ticker]?.action || "HOLD"}
            reason={
              stockRecommendInfo[hoveredAsset.ticker]?.reason || "Analyzing..."
            }
          />
        </div>
      )}
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
