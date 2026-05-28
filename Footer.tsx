import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <h3 className="text-2xl font-bold">EliteShop</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Your premium destination for quality products and exceptional shopping experience.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                <span className="text-sm">f</span>
              </div>
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                <span className="text-sm">t</span>
              </div>
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                <span className="text-sm">in</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-lg">Quick Links</h4>
            <ul className="space-y-3 text-gray-300">
              <li>
                <Link href="/electronics" className="hover:text-white transition-colors">
                  Electronics
                </Link>
              </li>
              <li>
                <Link href="/fashion" className="hover:text-white transition-colors">
                  Fashion
                </Link>
              </li>
              <li>
                <Link href="/books" className="hover:text-white transition-colors">
                  Books
                </Link>
              </li>
              <li>
                <Link href="/ladies" className="hover:text-white transition-colors">
                  Ladies
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-lg">Policies</h4>
            <ul className="space-y-3 text-gray-300">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Return Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Shipping Info
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-lg">Contact Info</h4>
            <div className="space-y-3 text-gray-300">
              <p className="flex items-center space-x-2">
                <span>📞</span>
                <span>+1 (555) 123-4567</span>
              </p>
              <p className="flex items-center space-x-2">
                <span>✉️</span>
                <span>support@eliteshop.com</span>
              </p>
              <p className="flex items-center space-x-2">
                <span>📍</span>
                <span>123 Commerce St, City, State 12345</span>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2025 EliteShop. All rights reserved. Made with ❤️ for amazing shopping experience.</p>
        </div>
      </div>
    </footer>
  )
}
