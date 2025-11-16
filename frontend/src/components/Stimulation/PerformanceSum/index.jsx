import "./index.css";

export default function PerformanceSum() {
  const dummyData = [
    {
      percentile: 10,
      totalReturn: 10,
      endBalance: 1100,
      meanAnnualReturn: 0.07,
      annualVol: 0.1,
      sharpio: 0.5,
    },
    {
      percentile: 25,
      totalReturn: 10,
      endBalance: 1100,
      meanAnnualReturn: 0.07,
      annualVol: 0.1,
      sharpio: 0.5,
    },
    {
      percentile: 50,
      totalReturn: 10,
      endBalance: 1100,
      meanAnnualReturn: 0.07,
      annualVol: 0.1,
      sharpio: 0.5,
    },
    {
      percentile: 75,
      totalReturn: 10,
      endBalance: 1100,
      meanAnnualReturn: 0.07,
      annualVol: 0.1,
      sharpio: 0.5,
    },
    {
      percentile: 90,
      totalReturn: 10,
      endBalance: 1100,
      meanAnnualReturn: 0.07,
      annualVol: 0.1,
      sharpio: 0.5,
    },
  ];
  const rows = [
    {
      label: "End Balance",
      key: "endBalance",
      format: (v) => `$${v.toLocaleString()}`,
    },
    { label: "Total Return", key: "totalReturn", format: (v) => `${v}%` },
    {
      label: "Mean Annual Return",
      key: "meanAnnualReturn",
      format: (v) => `${(v * 100).toFixed(2)}%`,
    },
    {
      label: "Annual Volatility",
      key: "annualVol",
      format: (v) => `${(v * 100).toFixed(2)}%`,
    },
    { label: "Sharpe Ratio", key: "sharpio" },
  ];

  return (
    <div className="performance-sum-container">
      <h3 style={{ color: "#3378f1" }}>Performance Summary</h3>
      <table className="performance-summary-table">
        <thead>
          <tr>
            <th></th>
            {dummyData.map((data) => (
              <th key={data.percentile}>{data.percentile}th percentile</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key}>
              <td>{row.label}</td>
              {dummyData.map((data) => (
                <td key={data.percentile}>
                  {row.format ? row.format(data[row.key]) : data[row.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
