import { ChevronUp, ChevronDown } from "lucide-react";
import "./index.css";

export default function MarketCapNow({ marketCap, percentChange }) {
  const isPositive = percentChange >= 0;
  const color = isPositive ? "#00b894" : "#d63031";
  const Icon = isPositive ? ChevronUp : ChevronDown;

  return (
    <li className="market-cap-now">
      <span style={{ fontSize: "20px", fontWeight: "bold" }}>Market Cap</span>
      <ul className="market-cap-value">
        <li style={{ padding: 0 }}>${(marketCap / 1e12).toFixed(1)}T</li>
        <li className="market-cap-change" style={{ color }}>
          <Icon color={color} size={14} strokeWidth={4} />
          {percentChange}%
        </li>
      </ul>
    </li>
  );
}
