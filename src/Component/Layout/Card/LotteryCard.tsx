import { Link } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { db, auth } from '../../../firebase/Firebase';
import { BsTags } from "react-icons/bs";
import { LuAlarmClock } from "react-icons/lu";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { collection, getDocs } from 'firebase/firestore';
import Loader from "../Loader/loading.gif"

interface LotteryData {
  name: string;
  ticketAmount: string;
  total: string;
  path?: string;
}

const LotteryCard: React.FC = () => {
  const [lotteryData, setLotteryData] = useState<{
    monthly: LotteryData[];
    weekly: LotteryData[];
    daily: LotteryData[];
  }>({
    monthly: [],
    weekly: [],
    daily: []
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const collections = ['Monthly Result', 'Weekly Result', 'Daily Result'];
      let allData: {
        monthly: LotteryData[];
        weekly: LotteryData[];
        daily: LotteryData[];
      } = {
        monthly: [],
        weekly: [],
        daily: []
      };

      for (const collectionName of collections) {
        try {
          const querySnapshot = await getDocs(collection(db, collectionName));
          const data = querySnapshot.docs.map(doc => ({
            name: doc.id,
            ticketAmount: doc.data().ticketAmount,
            total: doc.data().total,
            path: doc.data().path
          })).sort((a, b) => parseFloat(b.total.replace(/[^\d.-]/g, '')) - parseFloat(a.total.replace(/[^\d.-]/g, '')));

          if (collectionName === 'Monthly Result') {
            allData.monthly = data;
          } else if (collectionName === 'Weekly Result') {
            allData.weekly = data;
          } else if (collectionName === 'Daily Result') {
            allData.daily = data;
          }
        } catch (error) {
          console.error(`Error fetching data from ${collectionName}:`, error);
        }
      }

      setLotteryData(allData);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const [monthlyTime, setMonthlyTime] = useState('0d : 0h : 0m : 0s');
  const [weeklyTime, setWeeklyTime] = useState('0d : 0h : 0m : 0s');
  const [dailyTime, setDailyTime] = useState('0h : 0m : 0s');

  useEffect(() => {
    const updateTimers = () => {
      const now = new Date();

      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      nextMonth.setHours(12, 0, 0, 0);

      const nextWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (7 - now.getDay()));
      nextWeek.setHours(12, 0, 0, 0);

      const nextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      nextDay.setHours(12, 0, 0, 0);

      const calculateTime = (date: Date) => {
        const diff = date.getTime() - now.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return `${days}d : ${hours}h : ${minutes}m : ${seconds}s`;
      };

      setMonthlyTime(calculateTime(nextMonth));
      setWeeklyTime(calculateTime(nextWeek));
      setDailyTime(calculateTime(nextDay));
    };

    updateTimers();
    const intervalId = setInterval(updateTimers, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (!user) {
        window.location.href = '/signup';
      }
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <img src={Loader} alt="Loading..." />
      </div>
    );
  }

  return (
    <div className="cardCon mt-14 md:overflow-x-hidden sm:mt-20 md:mt-18 lg:mt-32 xl:mt-40 2xl:mt-48 w-full sm:w-full md:w-full lg:w-full mx-auto px-4 sm:px-0 flex flex-col gap-5 justify-center items-center">
      <h3 className="text-2xl font-extrabold m-3 text-center">Monthly Offers</h3>
      <div className="m-5 flex flex-wrap justify-center gap-5 sm:w-full sm:flex sm:flex-wrap sm:gap-4  md:w-full md:flex md:flex-wrap md:gap-4">
        {lotteryData.monthly.map((offer: LotteryData, index: number) => {
          const fullName = offer.name;
          const [firstName, lastName] = fullName.split(' ');

          return (
            <div key={index} className="box rounded-lg p-4 mb-1 w-[280px] sm:w-[400px] lg:w-[400px] xl:w-[600px] 2xl:w-[700px] h-[200px] shadow-xl transform hover:scale-105">
              <div className='belt bg-gradient-to-b h-12 from-slate-100 to-slate-300 w-[280px] sm:w-[400px] md:w-[400px] -ml-4 -mt-4 '>
                <h4 className="text-lg alfa text-blue-800 p-2" style={{ fontFamily: "'Font1', 'Font2', sans-serif", fontWeight: 'bold' }}>
                  <span className='text-xl' style={{ color: "blue" }}>{firstName}</span>{" "}
                  <span className='text-xl' style={{ fontFamily: "'Font2', sans-serif", color: "red" }}>{lastName}</span>
                </h4>
              </div>
              <h1 className="total text-xl font-extrabold mt-4 mb-2">₹ {offer.total}</h1>
              <div className='flex flex-row items-center gap-2'>
                <BsTags />
                <p className="text-sm text-gray-600">₹ {offer.ticketAmount}</p>
              </div>
              <div className="flex items-center">
                <LuAlarmClock />
                <span className="text-sm ml-2">{monthlyTime}</span>
              </div>
              <div className='flex flex-row items-center gap-2'>
                <IoIosInformationCircleOutline color='blue' />
                <Link to="/lottery-info" className="text-blue-500 no-underline">
                  <span>About</span>
                </Link>
              </div>
              <Link to={`/Monthly/${offer.path}`} className="flex justify-center">
                <button className="playbtn border-yellow-500 border-2 font-medium rounded-full text-yellow-500 ml-[120px] w-40 cursor-pointer md:w-32 md:p-1 md:-mt-4 md:ml-52" type="button">Play now</button>
              </Link>
            </div>
          );
        })}
      </div>

      <h3 className="text-2xl font-extrabold m-3 text-center">Weekly Offers</h3>
      <div className="m-5 flex flex-wrap justify-center gap-5 sm:w-full sm:flex sm:flex-wrap sm:gap-4 ">
        {lotteryData.weekly.map((offer: LotteryData, index: number) => {
          const fullName = offer.name;
          const [firstName, lastName] = fullName.split(' ');

          return (
            <div key={index} className="box rounded-lg p-4 mb-1 w-[280px] sm:w-[400px] lg:w-[400px] xl:w-[600px] 2xl:w-[700px] h-[200px] shadow-xl transform hover:scale-105">
              <div className='belt bg-gradient-to-b h-12 from-slate-100 to-slate-300 w-[280px] sm:w-[400px] md:w-[400px] -ml-4 -mt-4 '>
                <h4 className="text-lg alfa text-blue-800 p-2" style={{ fontFamily: "'Font1', 'Font2', sans-serif", fontWeight: 'bold' }}>
                  <span className='text-xl' style={{ color: "rgb(252, 103, 54)" }}>{firstName}</span>{" "}
                  <span className='text-xl' style={{ fontFamily: "'Font2', sans-serif", color: "rgb(65, 176, 110)" }}>{lastName}</span>
                </h4>
              </div>
              <h1 className="text-xl font-extrabold mt-4 mb-2">₹ {offer.total}</h1>
              <div className='flex flex-row items-center gap-2'>
                <BsTags />
                <p className="text-sm text-gray-600">₹ {offer.ticketAmount}</p>
              </div>
              <div className="flex items-center">
                <LuAlarmClock />
                <span className="text-sm ml-2">{weeklyTime}</span>
              </div>
              <div className='flex flex-row items-center gap-2'>
                <IoIosInformationCircleOutline color='blue' />
                <Link to="/lottery-info" className="text-blue-500 no-underline">
                  <span>About</span>
                </Link>
              </div>
              <Link to={`/Weekly/${offer.path}`} className="flex justify-center">
                <button className="border-yellow-500 border-2 font-bold rounded-full text-yellow-500 ml-[120px] w-40 cursor-pointer md:w-32 md:p-1 md:-mt-4 md:ml-52" type="button">Play now</button>
              </Link>
            </div>
          );
        })}
      </div>

      <h3 className="text-2xl font-extrabold m-3 text-center">Daily Offers<span className="block text-red-500 font-medium">(coming soon)</span></h3>
  <div className="m-5 pb-48 flex flex-wrap justify-center gap-5 sm:w-full sm:flex sm:flex-wrap sm:gap-4">
  {lotteryData.daily.map((offer: LotteryData, index: number) => {
    const fullName = offer.name;
    const nameParts = fullName.trim().split(' ');
    let firstName = '', middleName = '', lastName = '';

    if (nameParts.length === 1) {
      firstName = nameParts[0];
    } else {
      firstName = nameParts[0];
      lastName = nameParts[nameParts.length - 1];
      if (nameParts.length > 2) {
        middleName = nameParts.slice(1, -1).join(' ');
      }
    }

    return (
      <div key={index} className="box rounded-lg p-4 mb-1 w-[280px] sm:w-[400px] lg:w-[400px] xl:w-[600px] 2xl:w-[700px] h-[200px] shadow-xl transform hover:scale-105">
        <div className='belt bg-gradient-to-b h-12 from-slate-100 to-slate-300 w-[280px] sm:w-[400px] md:w-[400px] -ml-4 -mt-4'>
          <h4 className="text-lg alfa text-blue-800 p-2" style={{ fontFamily: "'Font1', 'Font2', sans-serif", fontWeight: 'bold' }}>
            {firstName && (
              <span className='text-xl' style={{ fontFamily: "'Font2', sans-serif", color: "rgb(139, 50, 44)" }}>
                {firstName}
                {(firstName === "GoldRush") && <span className="ml-2 text-xl absolute right-1" style={{ color: "rgb(252, 103, 54)" }}> x10</span>}
              </span>
            )}
            {middleName && (
              <span className='text-xl' style={{ fontFamily: "'Font2', sans-serif", color: "rgb(139, 50, 44)" }}>
                {middleName}
                {(middleName === "&") && <span className="ml-2 text-xl absolute right-1" style={{ color: "rgb(252, 103, 54)" }}> x10</span>}
              </span>
            )}
            {lastName && (
              <span className='text-xl' style={{ fontFamily: "'Font2', sans-serif", color: "rgb(139, 50, 44)" }}>
                {lastName}
                {(lastName === "shots"||lastName === "wave" || lastName === "victory") && <span className="ml-2 text-xl absolute right-1" style={{ color: "rgb(252, 103, 54)" }}>x10</span>}
              </span>
            )}
          </h4>
        </div>
        <h1 className="text-xl font-extrabold mt-4 mb-2">₹ {offer.total}</h1>
        <div className='flex flex-row items-center gap-2'>
          <BsTags />
          <p className="text-sm text-gray-600">₹ {offer.ticketAmount}</p>
        </div>
        <div className="flex items-center">
          <LuAlarmClock />
          <span className="text-sm ml-2">{dailyTime}</span>
        </div>
        <div className='flex flex-row items-center gap-2'>
          <IoIosInformationCircleOutline color='blue' />
          <Link to="/lottery-info" className="text-blue-500 no-underline">
            <span>About</span>
          </Link>
        </div>
        <Link to={`/Daily/${offer.path}`} className="flex justify-center">
          <button className="playbtn border-yellow-500 border-2 font-bold rounded-full text-yellow-500 ml-[120px] w-40 cursor-pointer md:w-32 md:p-1 md:-mt-4 md:ml-52" type="button" disabled>Play now</button>
        </Link>
      </div>
    );
  })}
</div>

    </div>
  );
};

export default LotteryCard;
