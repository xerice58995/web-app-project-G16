import "./index.css";
import PortfolioBar from "./PorfolioBar";

export default function MyPortfolios() {
  const portfolioDatas = [
    {
      name: "Portfolio 1",
      assets: [
        { ticker: "Bond", quantity: 40, price: 100 },
        { ticker: "Stock", quantity: 30, price: 200 },
        { ticker: "Cash", quantity: 30, price: 10 },
      ],
    },
  ];
  return (
    <div className="my-portfolios">
      <h1>My Portfolio</h1>
      {portfolioDatas.map((portfolioData, index) => (
        <PortfolioBar key={index} portfolioData={portfolioData} />
      ))}
    </div>
  );
}
