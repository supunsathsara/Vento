import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center">
      <main className="text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-4">Page Not Found</h1>
        <p className="text-xl mb-8">
          Sorry, the page you are looking for does not exist.
        </p>
        <Link to="/">
          <Button className="bg-purple-600 hover:bg-purple-700">
            Go to Homepage
          </Button>
        </Link>
      </main>
      <div className="fixed bottom-0 right-0 w-1/3 h-1/3 pointer-events-none">
        <div className="relative w-full h-full">
          <div className="absolute bottom-0 right-0 w-3/4 h-3/4 bg-purple-600 rounded-tl-full"></div>
          <div className="absolute bottom-8 right-8 w-1/2 h-1/2 bg-purple-800 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
