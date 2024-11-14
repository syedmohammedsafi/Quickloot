import React from 'react';
import '../footer/footer.css';

const Footer: React.FC = () => {
  const navLinks = [
    { name: "Home", path: "/dashboard" },
    { name: "Play Lottery", path: "/play-lottery" },
    { name: "Results", path: "/results" },
    { name: "How to Play", path: "/how-to-play" },
    { name: "About Us", path: "/about" },
    { name: "FAQ", path: "/faq" },
  ];

  return (
    <footer className="w-full sm:w-full md:absolute bg-gray-800 text-white p-6">
      <div className="w-full mx-auto">
        <div className="flex flex-col items-center justify-center">
          <nav className="w-full mb-4">
            <ul className="flex flex-wrap justify-center gap-4">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.path} className="text-blue-400 hover:underline">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <p className='reserve'>&copy; {new Date().getFullYear()} Lottery Website. All rights reserved.</p>
          <p className="contact mt-2">Contact us: <a href="l0tteryapp2024@gmail.com" className="text-blue-400 hover:underline">admin@quickloot.com</a></p>
          <div className="flex mt-4 space-x-4">
            <a href="https://www.facebook.com/quickloot" target="_blank" rel="noopener noreferrer" className="social text-blue-400 hover:underline">Facebook</a>
            <a href="https://www.twitter.com/quickloot" target="_blank" rel="noopener noreferrer" className="social text-blue-400 hover:underline">Twitter</a>
            <a href="https://www.instagram.com/quickloot" target="_blank" rel="noopener noreferrer" className="social text-blue-400 hover:underline">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
