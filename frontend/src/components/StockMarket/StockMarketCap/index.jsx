import "./index.css";
import MarketCapHistory from "./MarketCapHistory";
import MarketCapNow  from "./MarketCapNow";

export default function StockMarketCap({ data }) {
  const { marketCap, percentChange, marketRecentCapData } = data;
  return (
    <ul className="market-cap">
      <MarketCapNow marketCap={marketCap} percentChange={percentChange} />
      <MarketCapHistory marketCapData={marketRecentCapData} />
      <li className="third-block">Market Cap Item 3</li>
    </ul>
  );
}
