import React, { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Link, useNavigate } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { PlayCircleIcon, ChartPieIcon, SquaresPlusIcon, FingerPrintIcon, ArrowPathIcon, PhoneIcon } from "@heroicons/react/20/solid";
import { signOut } from "firebase/auth";
import logo from "../../../assets/logo.ico";
import Wallet from "../../Pages/Wallet/Wallet";
import { auth } from '../../../firebase/Firebase';

const Header = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tabs, setTabs] = useState([
    { name: "Play", href: "/dashboard", icon: PlayCircleIcon },
    { name: "Results", href: "/results", icon: ChartPieIcon },
    { name: "Tickets", href: "/", icon: SquaresPlusIcon },
    { name: "Account", href: "/profile", icon: FingerPrintIcon },
  ]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        if (user.email === "l0tteryapp2024@gmail.com") {
          setTabs([
            { name: "Play", href: "/dashboard", icon: PlayCircleIcon },
            { name: "Results", href: "/results", icon: ChartPieIcon },
            { name: "Tickets", href: "/", icon: SquaresPlusIcon },
            { name: "Admin", href: "/admin/dashboard", icon: FingerPrintIcon },
          ]);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const callsToAction = [
    { name: "Buy Tickets", href: "/", icon: ArrowPathIcon },
    { name: "Contact Support", href: "/support", icon: PhoneIcon },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      navigate('/signup');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      <nav className="bg-white dark:bg-gray-800 fixed top-0 z-50 w-full shadow">
        <div className="flex justify-between items-center p-4 lg:px-8">
          <div className="flex items-center">
            <img src={logo} alt="Lottery Logo" className="h-8 w-auto" />
          </div>
          <div className="hidden lg:flex space-x-10 ml-10 sm:w-20">
            <Wallet />
            {tabs.map((tab) => (
              <Link key={tab.name} to={tab.href} className="text-gray-600 hover:text-gray-900 dark:hover:text-white text-sm font-medium">
                {tab.name}
              </Link>
            ))}
          </div>
          <div className="lg:hidden">
            <button
              type="button"
              className="-m-2.5 p-2.5 rounded-md text-gray-700 dark:text-gray-200"
              onClick={toggleMobileMenu}>
              {mobileMenuOpen ? <XMarkIcon className="h-6 w-6" aria-hidden="true" /> : <Bars3Icon className="h-6 w-6" aria-hidden="true" />}
            </button>
          </div>
          <div className="hidden lg:flex items-center">
            {callsToAction.map((action) => (
              <Link key={action.name} to={action.href} className="ml-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm w-32">
                {action.name}
              </Link>
            ))}
            <button
              onClick={handleLogOut}
              className="text-gray-600 hover:text-gray-900 dark:hover:text-white ml-4 px-4 py-2 border border-gray-300 rounded-md text-sm w-32">
              Log out
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <Transition show={mobileMenuOpen} as={Fragment}>
        <Dialog as="div" className="lg:hidden fixed inset-0 z-40" onClose={toggleMobileMenu}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-full"
            enterTo="opacity-100 translate-y-0"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-full">
            <div className="fixed inset-x-0 bottom-0 z-50 bg-white dark:bg-gray-800 shadow-xl">
              <div className="p-4">
                {tabs.map((tab) => (
                  <div key={tab.name} className="flex flex-row mb-4">
                    <Link
                      to={tab.href}
                      className="block py-2 font-medium text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300"
                      onClick={toggleMobileMenu}>
                      {tab.name}
                    </Link>
                  </div>
                ))}
                <Wallet />
                {callsToAction.map((action) => (
                  <Link
                    key={action.name}
                    to={action.href}
                    className="flex flex-col border-8 border-white rounded-xl justify-center items-center w-full text-center text-white bg-blue-600 hover:bg-blue-700 py-2  text-sm font-medium"
                    onClick={toggleMobileMenu}>
                    {action.name}
                  </Link>
                ))}
                <button
                  onClick={() => { handleLogOut(); toggleMobileMenu(); }}
                  className="w-full mt-4 text-center py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700">
                  Log out
                </button>
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
};

export default Header;
