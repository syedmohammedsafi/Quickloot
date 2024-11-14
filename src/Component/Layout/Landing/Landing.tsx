import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon, UsersIcon, EyeIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.ico";
import Footer from "../footer/Footer";
import { GiTrophy } from "react-icons/gi";
import bg from '../../../assets/gambling.jpeg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';


export default function Landing() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleLoginClick = (event) => {
    event.preventDefault();
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/signup');
    }
  };

  const handleLearnMoreClick = () => {
    setShowModal(true);
  };

  const navigation = [
    { name: "Home", href: "/dashboard" },
    { name: "About", href: "#" },
    { name: "Contact", href: "#" },
  ];

  return (
    <div className="bg-white"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100%',
      }}>
      <header className="fixed inset-x-0 top-0 z-50">
        <nav
          className="flex items-center justify-between p-6 lg:px-8 bg-white/60 backdrop-blur border border-white/30 shadow-lg"
          aria-label="Global">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Quickloot</span>
              <img src={logo} alt="Quickloot logo" className="h-10 w-10" />
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}>
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-8 w-10 text-black" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-semibold leading-6 text-gray-900">
                {item.name}
              </a>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <a
              onClick={handleLoginClick}
              className="text-sm font-semibold leading-6 text-gray-900 cursor-pointer">
              Log in →
            </a>
          </div>
        </nav>
        <Dialog
          as="div"
          className="lg:hidden"
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}>
          <div className="fixed inset-0 z-50" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}>
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-200">
                <div className="space-y-4 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block rounded-lg px-4 py-3 text-base font-semibold leading-7 text-gray-900 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-pink-500 hover:to-indigo-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out">
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="py-6">
                  <a
                    className="block rounded-lg px-4 py-3 text-base font-semibold leading-7 text-gray-900 bg-gradient-to-r from-green-400 to-blue-500 hover:from-blue-500 hover:to-green-400 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer"
                    onClick={handleLoginClick}>
                    Log in
                  </a>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>

      <div className="relative isolate px-6 lg:px-8">
        <div className="mx-auto max-w-2xl relative top-6 py-32 sm:py-32 lg:py-48 text-center">
          <h1 className="text-2xl md:text-4xl font-bold font-mono tracking-tight text-white sm:text-6xl">
            Discover the Thrill of Winning with Quickloot!
          </h1>
          <p className="mt-10 text-md font-serif md:text-lg lg:text-xl leading-8 text-white">
            Welcome to Quickloot, where the excitement never ends! Our platform delivers an unmatched experience in online lotteries, offering a world of thrilling possibilities to our players. With cutting-edge technology and a user-friendly design, Quickloot creates a seamless and secure environment for lottery enthusiasts from across the globe.          </p>
          <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-x-6">
            <a
              onClick={handleLoginClick}
              className="cursor-pointer bg-white/70 rounded-full px-8 py-4 text-lg font-bold text-blue-950 shadow-md backdrop-blur border border-white/30 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Start Playing
            </a>
            <a
              href="#"
              onClick={handleLearnMoreClick}
              className="text-sm font-semibold leading-6 text-white mt-4 md:mt-0">
              Learn More →
            </a>
          </div>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-5 md:space-y-0 md:space-x-5 mt-20">
            <div className="w-full md:w-1/3 bg-white/60 p-6 rounded-lg shadow-md border border-white/30 backdrop-blur">
              <h1 className="text-lg font-bold text-black mb-2">Total Users</h1>
              <div className="flex flex-row gap-3 mt-1">
                <UsersIcon className="h-6 w-6 text-black  relative left-12 sm:-left-3" aria-hidden="true" />
                <p className="text-black ml-12 sm:-ml-4">90,000,000+ Users</p>
              </div>
            </div>
            <div className="w-full md:w-1/3 bg-white/60 p-6 rounded-lg shadow-md border border-white/30 backdrop-blur">
              <h1 className="text-lg font-bold text-black mb-2">Total Winners</h1>
              <div className="flex flex-row gap-3 mt-1">
                <GiTrophy className="h-6 w-6 text-black  relative left-12 sm:-left-2" aria-hidden="true" />
                <p className="text-black ml-12 sm:-ml-4">8,00,000+ Winners</p>
              </div>
            </div>
            <div className="w-full md:w-1/3 bg-white/60 p-6 rounded-lg shadow-md border border-white/30 backdrop-blur">
              <h1 className="text-lg font-bold text-black mb-2">Total Visitors</h1>
              <div className="flex flex-row gap-3 mt-1">
                <EyeIcon className="h-6 w-6 text-black relative left-12 sm:-left-4 " aria-hidden="true" />
                <p className="text-black ml-12 sm:-ml-7">120,000,000+ Visitors</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Footer />
      </div>
      {showModal && (
        <div className="lg:w-[1600px] flex justify-center ">
          <div className="absolute top-28 bg-gray-800 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto text-center">
              <button
                className="absolute top-4 right-4 text-black"
                onClick={() => setShowModal(false)}
              >
                <FontAwesomeIcon icon={faTimes} size="2x" />
              </button>

              <h1 className="text-3xl md:text-4xl font-bold font-mono tracking-tight text-black sm:text-5xl mb-6">
                Why Choose Quickloot?
              </h1>
              <p className="text-lg leading-relaxed mb-4 text-left">
                <strong>1. Unrivaled Experience:</strong> Immerse yourself in a world of excitement and anticipation as you participate in our diverse range of lotteries. From classic draws to innovative games, Quickloot offers something for everyone.
              </p>
              <p className="text-lg leading-relaxed mb-4 text-left">
                <strong>2. State-of-the-Art Technology:</strong> Our advanced platform leverages the latest technology to ensure a smooth and hassle-free lottery experience. Whether you're accessing Quickloot from your desktop or mobile device, you can count on seamless performance every time.
              </p>
              <p className="text-lg leading-relaxed mb-4 text-left">
                <strong>3. User-Friendly Design:</strong> Navigating Quickloot is a breeze thanks to our intuitive design. Find your favorite lotteries, check results, and manage your tickets with ease, all within a sleek and modern interface.
              </p>
              <p className="text-lg leading-relaxed mb-6 text-left">
                <strong>4. Secure Environment:</strong> At Quickloot, security is our top priority. We employ robust measures to safeguard your personal information and transactions, providing you with peace of mind as you play.
              </p>
              <h2 className="text-2xl md:text-3xl font-bold font-mono tracking-tight text-black sm:text-4xl mb-6">
                Join Quickloot Today!
              </h2>
              <p className="text-lg leading-relaxed text-left">
                Don't miss out on the excitement – join Quickloot today and start your journey to big wins! Whether you're a seasoned player or new to the world of lotteries, there's never been a better time to get started. Sign up now and discover why Quickloot is the ultimate destination for lottery enthusiasts worldwide.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}