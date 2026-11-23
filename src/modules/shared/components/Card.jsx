function Card({ children, className = '', ...restProps }) {
  return (
    <div
      className={`bg-med-card border border-med-border rounded-xl shadow-xs p-5 ${className}`}
      {...restProps}
    >
      {children}
    </div>
  );
}

export default Card;
