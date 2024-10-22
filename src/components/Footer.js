import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa"; // Importing React Icons

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-10">
      <div className="w-[95%] mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Column 1: About */}
        <div>
          <h3 className="text-lg font-bold mb-4">About Us</h3>
          <p className="text-sm">
            We are committed to providing the best food delivery experience.
            Explore our wide range of restaurants and enjoy your favorite meals!
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="text-lg font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-gray-400">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-400">
                Contact
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-400">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-400">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Follow Us */}
        <div>
          <h3 className="text-lg font-bold mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF className="text-xl hover:text-gray-400" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="text-xl hover:text-gray-400" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter className="text-xl hover:text-gray-400" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedinIn className="text-xl hover:text-gray-400" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Section */}
      <div className="text-center mt-10">
        <p className="text-sm">
          &copy; 2024 Food Delivery App. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
