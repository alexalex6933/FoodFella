import { Link } from 'react-router-dom';

const Footer = () => {
    return (
      <footer className="bg-gray-900 text-white text-center py-6 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm">&copy; {new Date().getFullYear()} FoodFella. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link to="/about" className="hover:text-[#1db954] transition-colors text-sm">About Us</Link>
            <Link to="/contact" className="hover:text-[#1db954] transition-colors text-sm">Contact</Link>
            <Link to="/terms" className="hover:text-[#1db954] transition-colors text-sm">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-[#1db954] transition-colors text-sm">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;