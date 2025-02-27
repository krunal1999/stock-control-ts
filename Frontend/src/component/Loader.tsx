import { ClipLoader } from "react-spinners";

const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <ClipLoader size={80} color="#3498db" />
    </div>
  );
};

export default Loader;
