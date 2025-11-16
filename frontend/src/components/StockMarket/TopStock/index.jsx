import "./index.css";
import StockInfo from "./StockInfo";

export default function TopStock() {
  const stocks = [
    { ticker: "AAPL", price: 150, change: 1.2 },
    { ticker: "MSFT", price: 280, change: 0.5 },
    { ticker: "AMZN", price: 3400, change: 2.1 },
  ];
  return (
    <ul className="top-stock">
      {stocks.map((stock) => (
        <li key={stock.ticker}>
          <StockInfo stock={stock} />
        </li>
      ))}
    </ul>
  );
}
