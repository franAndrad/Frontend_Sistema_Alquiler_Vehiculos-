import './LoadingSkeleton.css';

function LoadingSkeleton({ type = 'table', rows = 5 }) {
  if (type === 'table') {
    return (
      <div className="skeleton-container">
        <div className="skeleton-table">
          <div className="skeleton-header">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton-cell skeleton-header-cell"></div>
            ))}
          </div>
          {[...Array(rows)].map((_, rowIndex) => (
            <div key={rowIndex} className="skeleton-row">
              {[...Array(6)].map((_, cellIndex) => (
                <div key={cellIndex} className="skeleton-cell"></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className="skeleton-container">
        <div className="skeleton-card-grid">
          {[...Array(rows)].map((_, i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-card-header"></div>
              <div className="skeleton-card-body">
                <div className="skeleton-line"></div>
                <div className="skeleton-line short"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="skeleton-container">
      <div className="skeleton-line"></div>
      <div className="skeleton-line short"></div>
      <div className="skeleton-line"></div>
    </div>
  );
}

export default LoadingSkeleton;

