import "./index.css";

export default function MarketCapHistory({ marketCapData }) {
  const { yesterday, lastWeek, lastMonth } = marketCapData;
  return (
    <li className="market-cap-history">
      <span style={{ fontSize: "20px", fontWeight: "bold" }}>
        Market Cap Historical Values
      </span>
      <ul>
        <li>
          <span>Yesterday</span>{" "}
          <strong>${(yesterday / 1e12).toFixed(1)}T</strong>
        </li>
        <li>
          <span>Last Week</span>{" "}
          <strong>${(lastWeek / 1e12).toFixed(1)}T</strong>
        </li>
        <li>
          <span>Last Month</span>{" "}
          <strong>${(lastMonth / 1e12).toFixed(1)}T</strong>
        </li>
      </ul>
    </li>
  );
}
