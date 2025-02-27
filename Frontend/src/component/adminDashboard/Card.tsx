interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={`p-4 border rounded-xl shadow-md bg-white ${className}`}>
      {children}
    </div>
  );
};

export default Card;
