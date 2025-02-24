import { Link } from "react-router";

const NotFound = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center flex-col gap-7">
      <h1 className="text-3xl">404 - Page Not Found</h1>
      <Link to={"/dashboard"} replace={true}>
        Return home
      </Link>
    </div>
  );
};

export default NotFound;
