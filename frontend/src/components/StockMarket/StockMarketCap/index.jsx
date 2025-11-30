import "./index.css";
import MarketCapHistory from "./MarketCapHistory";
import MarketCapNow  from "./MarketCapNow";

export default function StockMarketCap({ data }) {
  const { marketCap, percentChange, marketRecentCapData } = data;
  return (
    <ul className="market-cap">
      <MarketCapNow marketCap={marketCap} percentChange={percentChange} />
      <MarketCapHistory marketCapData={marketRecentCapData} />
      <MarketCapHistory marketCapData={marketRecentCapData} />
    </ul>
  );
}
