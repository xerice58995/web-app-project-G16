export default function StockAdviceDark({
  ticker = "AAPL",
  action = "REDUCE",
  reason = "波動風險過高，建議降低持倉比例",
}) {
  const isNegative = ["REDUCE", "SELL"].includes(action);
  const accentColor = isNegative ? "#ef4444" : "#10b981"; // Red vs Green

  return (
    <div
      style={{
        backgroundColor: "#1e293b", // Slate 800
        color: "white",
        width: "280px",
        borderRadius: "6px",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
        borderLeft: `4px solid ${accentColor}`, // The accent stripe
        fontFamily: "'Inter', sans-serif",
        padding: "16px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "8px",
          alignItems: "baseline",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "700" }}>
          {ticker}
        </h2>
        <span
          style={{
            color: accentColor,
            fontWeight: "600",
            fontSize: "12px",
            border: `1px solid ${accentColor}`,
            padding: "2px 6px",
            borderRadius: "4px",
          }}
        >
          {action}
        </span>
      </div>

      <div
        style={{ height: "1px", background: "#334155", marginBottom: "10px" }}
      ></div>

      <p
        style={{
          margin: 0,
          fontSize: "13px",
          color: "#94a3b8",
          lineHeight: "1.5",
        }}
      >
        {reason}
      </p>
    </div>
  );
}
