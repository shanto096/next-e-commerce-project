import Link from 'next/link';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer style={{
      background: 'var(--card-bg)',
      color: 'var(--foreground)',
    }} className=" py-12 mt-20 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="mb-6 md:mb-0">
            <h3 className="text-2xl font-bold text-green-600 mb-4">AmarShop</h3>
            <p className="text-sm leading-relaxed">
              Your one-stop shop for fresh, organic, and healthy products delivered right to your doorstep.
              Quality and freshness guaranteed.
            </p>
          </div>

          {/* Quick Links */}
          <div className="mb-6 md:mb-0">
            <h3 className="text-lg font-semibold  mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-green-400 transition-colors duration-200">Home</Link></li>
              <li><Link href="/products" className="hover:text-green-400 transition-colors duration-200">Shop</Link></li>
              <li><Link href="/about" className="hover:text-green-400 transition-colors duration-200">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-green-400 transition-colors duration-200">Contact</Link></li>
              <li><Link href="/faq" className="hover:text-green-400 transition-colors duration-200">FAQ</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="mb-6 md:mb-0">
            <h3 className="text-lg font-semibold  mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link href="/products?category=Vegetables" className="hover:text-green-400 transition-colors duration-200">Vegetables</Link></li>
              <li><Link href="/products?category=Fruits" className="hover:text-green-400 transition-colors duration-200">Fruits</Link></li>
              <li><Link href="/products?category=Bread" className="hover:text-green-400 transition-colors duration-200">Bread</Link></li>
              <li><Link href="/products?category=Meat" className="hover:text-green-400 transition-colors duration-200">Meat</Link></li>
              <li><Link href="/products?category=Dairy" className="hover:text-green-400 transition-colors duration-200">Dairy & Eggs</Link></li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-lg font-semibold  mb-4">Connect With Us</h3>
            <p className="text-sm mb-2">Email: <a href="mailto:info@ecommerce.com" className="hover:text-green-400 transition-colors duration-200">info@ecommerce.com</a></p>
            <p className="text-sm mb-4">Phone: <a href="tel:+880123456789" className="hover:text-green-400 transition-colors duration-200">+880 123 456789</a></p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200">
                <FaFacebookF size={24} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200">
                <FaTwitter size={24} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200">
                <FaInstagram size={24} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200">
                <FaLinkedinIn size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} E-Commerce. All rights reserved.</p>
          <p className="mt-2">Designed with ❤️ by Shanto Kumar</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;