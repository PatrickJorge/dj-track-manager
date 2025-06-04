import React from 'react';
import { Link } from 'react-router-dom';
import { Music2, Home } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center p-6 text-center">
      <Music2 className="h-20 w-20 text-primary-500 mb-6" />
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-dark-300 max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/" className="btn-primary flex items-center">
        <Home className="h-5 w-5 mr-2" />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
};

export default NotFound;