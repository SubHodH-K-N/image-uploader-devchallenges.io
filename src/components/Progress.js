const Progress = ({ percentage }) => {
  return (
    <>
      <h1 className="loading">Loading...</h1>
      <div className="progressbar">
        <div className="progress" style={{ width: `${percentage}%` }}></div>
      </div>
    </>
  );
};

export default Progress;
