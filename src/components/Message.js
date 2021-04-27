const Message = ({ message, color }) => {
  return (
    <div className="message" style={{ backgroundColor: `${color}` }}>
      {message}
    </div>
  );
};

export default Message;
