import { FallbackProps } from "react-error-boundary";
import { useNavigate } from "react-router";

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  const navigate = useNavigate();

  const handleRetry = () => {
    navigate("/dashboard", { replace: true });
    resetErrorBoundary();
  };

  return (
    <div
      role="alert"
      className="flex flex-col justify-center items-center bg-tuna-1000 h-screen w-full"
    >
      <p className="text-white text-xl">Something went wrong:</p>
      <pre className="text-red-300 mt-2">{error.message}</pre>
      <button
        onClick={handleRetry}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Try again
      </button>
    </div>
  );
};

export default ErrorFallback;
