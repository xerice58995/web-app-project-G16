import "./index.css";

export default function EmptyContent({ message, icon }) {
  return (
    <div className="empty-state-container">
      {icon}
      <h3 className="empty-state-title">{message}</h3>
      <p className="empty-state-description">
        Get started by creating your first investment portfolio to track your
        assets and performance.
      </p>
    </div>
  );
}
