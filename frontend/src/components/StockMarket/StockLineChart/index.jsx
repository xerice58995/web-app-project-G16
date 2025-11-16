import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import "./index.css";


export default function StockLineChart({ stockData }) {
  const searchStock = () => {
    const symbol = document.getElementById("stock-symbol").value;
    console.log("Searching for stock symbol:", symbol);
    // Implement stock search logic here
  }
  return (
    <div className="stock-line-chart-container">
      <div className="stock-search">
        <input
          id="stock-symbol"
          type="text"
          className="entered-symbol"
          placeholder="Enter stock symbol"
        />
        <button className="search-btn">Search</button>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={stockData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e272e", // dark background
              border: "none",
              borderRadius: "8px",
              color: "#dfe6e9",
            }}
            labelStyle={{ color: "#00b894" }}
            itemStyle={{ color: "#dfe6e9" }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#00b894"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}