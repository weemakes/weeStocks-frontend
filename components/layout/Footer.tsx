import Link from 'next/link';
import { Mail, Phone } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 border-t border-gray-800 mt-32">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center font-bold text-xl text-white">
                W
              </div>
              <span className="text-xl font-bold text-white">WeeStox</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Your Guide to Halal Investing & Financial Intelligence. Make informed, Shariah-compliant investment decisions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-blue-500 text-sm transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/stocks" className="text-gray-400 hover:text-blue-500 text-sm transition-colors">
                  Halal Stocks
                </Link>
              </li>
              <li>
                <Link href="/ipo" className="text-gray-400 hover:text-blue-500 text-sm transition-colors">
                  IPO Listings
                </Link>
              </li>
              <li>
                <Link href="/zakat" className="text-gray-400 hover:text-blue-500 text-sm transition-colors">
                  Zakat Calculator
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-blue-500 text-sm transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Metal Rates */}
          <div>
            <h4 className="text-white font-semibold mb-4">Metal Rates</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/gold/agra" className="text-gray-400 hover:text-blue-500 text-sm transition-colors">
                  Gold Rates
                </Link>
              </li>
              <li>
                <Link href="/silver/agra" className="text-gray-400 hover:text-blue-500 text-sm transition-colors">
                  Silver Rates
                </Link>
              </li>
              <li>
                <Link href="/platinum/agra" className="text-gray-400 hover:text-blue-500 text-sm transition-colors">
                  Platinum Rates
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Mail className="w-4 h-4 text-blue-500" />
                <a href="mailto:info@weestox.com" className="hover:text-blue-500 transition-colors">
                  info@weestox.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Phone className="w-4 h-4 text-blue-500" />
                <a href="tel:+1234567890" className="hover:text-blue-500 transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
            <div className="mt-4">
              <h5 className="text-white font-medium text-sm mb-2">Newsletter</h5>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
                <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {currentYear} WeeStox - Your Halal Investment Guide. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-gray-500 hover:text-blue-500 text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-blue-500 text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/disclaimer" className="text-gray-500 hover:text-blue-500 text-sm transition-colors">
                Disclaimer
              </Link>
            </div>
          </div>
          <p className="text-gray-600 text-xs mt-4 text-center md:text-left">
            Disclaimer: WeeStox provides information for educational purposes only. Please consult with qualified financial and Islamic scholars before making investment decisions.
          </p>
        </div>
      </div>
    </footer>
  );
}
