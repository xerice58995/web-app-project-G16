import { useState } from "react";
import "./index.css";

export default function PortfolioEdit({ portfolioData }) {
  const { name, assets } = portfolioData;

  // Make a copy of assets in state
  const [assetList, setAssetList] = useState(assets);

  // Handler for input change
  const handleAllocationChange = (index, value) => {
    const newAssets = [...assetList];
    newAssets[index].allocation = Number(value); // convert to number
    setAssetList(newAssets);
  };

  const handleClassChange = (idx, value) => {
    if (!value || value === "") return;

    const isDuplicate = assetList.some(
      (asset, index) => index !== idx && asset.class === value
    );

    if (isDuplicate) {
      alert(`"${value}" is already selected for another asset`);
      return;
    }
    const newAssets = assetList.map((asset, index) =>
      index === idx ? { ...asset, assetName: value } : asset
    );

    setAssetList(newAssets);
  };

  const removeAsset = (index) => {
    const newAssets = assetList.filter((_, i) => i !== index);
    setAssetList(newAssets);
  };

  const addAsset = () => {
    const newAssets = [
      ...assetList,
      {
        assetName: "",
        allocation: 0,
      },
    ];
    setAssetList(newAssets);
  };

  return (
    <div className="portfolio-edit-container">
      <header>Portfolio Model Configuration</header>
      <nav className="portfolio-nav">
        <li>Settings</li>
        <li>Portfolio Assets</li>
      </nav>
      <table className="portfolio-edit-table">
        <thead>
          <tr>
            <th>Asset Class</th>
            <th>Allocation</th>
          </tr>
        </thead>
        <tbody className="portfolio-edit-body">
          {assetList.map((asset, index) => (
            <tr key={index}>
              <th>
                <select
                  value={asset.assetName || ""}
                  onChange={(e) => handleClassChange(index, e.target.value)}
                >
                  <option value="" disabled>
                    Select Asset Class...
                  </option>
                  <option value="Equity">Equity</option>
                  <option value="Bond">Bond</option>
                  <option value="Cash">Cash</option>
                </select>
              </th>
              <td className="allocation-cell">
                <div className="allocation-wrapper">
                  <div className="allocation-input-group">
                    <input
                      id=""
                      type="number"
                      value={asset.quantity || 0}
                      onChange={(e) =>
                        handleAllocationChange(index, e.target.value)
                      }
                    />
                    <span className="percent-symbol">%</span>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => {
                      removeAsset(index);
                    }}
                  >
                    Remove
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "16px",
        }}
      >
        <button className="save-btn">Save</button>
        <button className="add-btn" onClick={addAsset}>
          + Add Asset
        </button>
      </div>
    </div>
  );
}
