import "./index.css";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function StockInfo({ stock }) {
  return (
    <div className="stock-info">
      <h2 className="ticker">{stock.ticker}</h2>
      <p className="price">${stock.price}</p>
      <p className="change">
        Change: {stock.change}%{" "}
        {stock.change > 0 ? (
          <TrendingUp className="icon" color="green" strokeWidth={2.5} />
        ) : (
          <TrendingDown className="icon" color="red" strokeWidth={2.5} />
        )}
      </p>
    </div>
  );
}
