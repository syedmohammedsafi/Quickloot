import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc } from "firebase/firestore";
import LotteryInfo from '../../../Layout/Lotteryinfo/LotteryInfo';
import MonthlyTicket from '../../../Layout/ticket/Daily/Bet&Win';
import Header from '../../../Layout/Header/Header';
import Footer from '../../../Layout/footer/Footer';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSearch } from '@fortawesome/free-solid-svg-icons';

Modal.setAppElement('#root');

const MonthlyGame: React.FC = () => {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [ticketModalOpen, setTicketModalOpen] = useState<boolean>(false);
  const [ticketCode, setTicketCode] = useState<number | null>(null);
  const [ticketCodes, setTicketCodes] = useState<number[]>([]);
  const [displayedTicketCodes, setDisplayedTicketCodes] = useState<number[]>([]);
  const [search, setSearch] = useState('');
  const [ticketsGenerated, setTicketsGenerated] = useState(false);
  const [soldTickets, setSoldTickets] = useState<string[]>([]);
  const [ticketsDisplayedCount, setTicketsDisplayedCount] = useState(300);
  const ticketsPerPage = 300;
  const db = getFirestore();

  useEffect(() => {
    const fetchSoldTickets = async () => {
      try {
        const monthlyDocRef = doc(db, "Daily", "Bet & Win");
        const monthlyDocSnap = await getDoc(monthlyDocRef);
        if (monthlyDocSnap.exists()) {
          const data = monthlyDocSnap.data();
          if (data && data.tickets) {
            const ticketsArray = Object.values(data.tickets);
            setSoldTickets(ticketsArray.map(ticket => ticket.toString()));
          }
        }
      } catch (error) {
        console.error("Error fetching sold tickets:", error);
      }
    };
    
    fetchSoldTickets();
    const id = setInterval(fetchSoldTickets, 200);
    
    return () => {
      clearInterval(id);
    };
  }, [db]);

  const toggleNumber = (number: number) => {
    if (selectedNumbers.length === 5 && !selectedNumbers.includes(number)) {
      return;
    }
    const updatedNumbers = selectedNumbers.includes(number)
      ? selectedNumbers.filter((num) => num !== number)
      : [...selectedNumbers, number];
    setSelectedNumbers(updatedNumbers);
  };

  const generateTickets = () => {
    const specificCodes = [661000, 661001, 661011, 661111, 661112, 661122, 661222, 662222];
    let generatedCodes = [...specificCodes];
    let lastGeneratedCode = specificCodes[specificCodes.length - 1];

    while (generatedCodes.length <3400) {
      lastGeneratedCode++;
      generatedCodes.push(lastGeneratedCode);
    }

    setTicketCodes(generatedCodes);
    setDisplayedTicketCodes(generatedCodes.slice(0, ticketsDisplayedCount));
    setTicketsGenerated(true);
  };

  const loadMoreTickets = () => {
    const newTicketsDisplayedCount = ticketsDisplayedCount + ticketsPerPage;
    setDisplayedTicketCodes(ticketCodes.slice(0, newTicketsDisplayedCount));
    setTicketsDisplayedCount(newTicketsDisplayedCount);
  };

  const renderTicketButtons = () => {
    const filteredCodes = displayedTicketCodes.filter(code => code.toString().includes(search));

    return filteredCodes.map((code, index) => {
      const isSold = soldTickets.includes(code.toString());
      return (
        <button
          onClick={() => {
            setTicketCode(code);
            setTicketModalOpen(true);
          }}
          key={index}
          className={`w-36 mx-3 sm:w-80 sm:mx-5 text-white font-bold py-2 px-4 border border-transparent rounded mt-3 transition ease-in-out duration-150 transform hover:scale-105 ${isSold ? 'opacity-50 cursor-not-allowed bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 flex justify-start' : 'bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700'}`}
          disabled={isSold}
          style={{ position: 'relative' }}
        >
          {isSold && <span className="absolute top-0 right-0 bg-red-500 text-white py-1 px-2 rounded-full text-xs">Sold</span>}
          BW{code}
        </button>
      );
    });
  };

  const renderNumbers = () => {
    const numbers: JSX.Element[] = [];
    for (let i = 1; i <= 100; i++) {
      const isSelected = selectedNumbers.includes(i);
      numbers.push(
        <div
          key={i}
          className={`number ${isSelected ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-full mr-2 mb-2 w-7 h-7 flex items-center justify-center border border-gray-300 shadow-lg cursor-pointer transition duration-300 ease-in-out transform hover:scale-110`}
          onClick={() => toggleNumber(i)}
        >
          {i}
        </div>
      );
    }
    return (
      <div className='bg-green-500 h-[620px] w-[340px] rounded-xl flex flex-col items-center justify-center p-2'>
        <h1 className='font-extrabold text-2xl text-white m-10'>Bet & Win</h1>
        <div className='bg-blue-300 w-[320px] rounded-xl p-3 flex flex-col items-center'>
          <div className="grid grid-cols-10 gap-1 bg-blue-300 rounded-md w-[300px]">
            {numbers}
          </div>
          <button
            className="generate bg-blue-500 mt-4 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={generateTickets}
            disabled={selectedNumbers.length !== 5}
          >
            Available Tickets
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className='sm:overflow-hidden w-full flex flex-col items-center justify-center mb-10'>
        <Header />
        <div className='mt-20'>
          <LotteryInfo gameName={"Bet & Win"} />
        </div>
        <h2 className="text-xl sm:text-2xl mt-8 font-semibold mb-6 text-center">Select your 5 numbers (1-100)</h2>
        {renderNumbers()}
        {ticketsGenerated && (
          <>
            <div className="relative mt-4 mb-4 w-64">
              <input
                type="text"
                placeholder="Search 6-digits(661000)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="text-center border border-gray-300 rounded p-2 pl-10 w-full"
              />
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1 pl-3 pr-3">
              {renderTicketButtons()}
            </div>
            {displayedTicketCodes.length < ticketCodes.length && (
              <div className="w-full flex justify-center mt-4">
                <button
                  onClick={loadMoreTickets}
                  className="text-red-600 font-bold"
                ><span className="text-gray-600 mb-2">
                ({ticketCodes.length - displayedTicketCodes.length} )
              </span>
                 ... More ...
                </button>
              </div>
            )}
          </>
        )}
        <Modal
          isOpen={ticketModalOpen}
          onRequestClose={() => setTicketModalOpen(false)}
          contentLabel="Ticket Modal"
          style={{
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1000
            },
            content: {
              width: '100%',
              height: '60%',
              marginTop: '60px',
              marginLeft: '-40px',
              border: 'none',
              background: 'rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
              borderRadius: '8px',
              padding: '20px',
              paddingRight: '10px',
            }
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <FontAwesomeIcon
              icon={faTimes}
              onClick={() => setTicketModalOpen(false)}
              style={{ cursor: 'pointer', backgroundColor: 'rgba(0,0,0,0.5)', padding: '5px', borderRadius: '50%', color: 'white' }}
            />
          </div>
          <MonthlyTicket
            selectedNumbers={selectedNumbers}
            ticketCode={ticketCode}
            closeModal={() => setTicketModalOpen(false)}
          />
        </Modal>
      </div>
      <Footer />
    </>
  );
};

export default MonthlyGame;
