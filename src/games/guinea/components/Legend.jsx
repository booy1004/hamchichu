export default function Legend() {
  return (
    <div className="gp-legend">
      <span className="gp-legend-title">📋 점수표</span>
      <span className="gp-legend-item"><span className="legend-dot legend-none" /> 1점</span>
      <span className="gp-legend-item"><span className="legend-dot legend-green" /> 2점</span>
      <span className="gp-legend-item"><span className="legend-dot legend-yellow" /> 3점</span>
      <span className="gp-legend-item"><span className="legend-dot legend-orange" /> 4점</span>
      <span className="gp-legend-item"><span className="legend-dot legend-red" /> 5점</span>
    </div>
  );
}
