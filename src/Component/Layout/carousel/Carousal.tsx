import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../../firebase/Firebase';
import { collection, getDocs } from 'firebase/firestore';
import './carousal.css';

interface LotteryData {
  id: string;
  result: string;
}

const LotteryCarousel: React.FC = () => {
  const [lotteryData, setLotteryData] = useState<LotteryData[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showResults, setShowResults] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      const collections = ['Monthly Result', 'Weekly Result', 'Daily Result'];
      let allData: LotteryData[] = [];

      for (const collectionName of collections) {
        const querySnapshot = await getDocs(collection(db, collectionName));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          result: doc.data().result
        }));
        allData = [...allData, ...data];
      }

      const duplicatedData = [...allData, ...allData, ...allData, ...allData];
      setLotteryData(duplicatedData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      const scrollInterval = setInterval(() => {
        if (carousel.scrollLeft !== null) {
          carousel.scrollLeft += 1;
          if (carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth) {
            carousel.scrollLeft = carousel.scrollWidth / 2;
          }
        }
      }, 30);
      return () => clearInterval(scrollInterval);
    }
  }, [lotteryData]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      const hours = now.getHours();
      setShowResults(hours >= 12 && hours < 15);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const now = new Date();
    const hours = now.getHours();
    setShowResults(hours >= 11 && hours < 15);
  }, [currentTime]);

  return (
    <div className="slide carousel border-2 overflow-x-hidden flex p-4" ref={carouselRef}>
      {showResults ? (
        lotteryData.map((game, index) => (
          <div key={index} className="smallCard -mt-2 carousel-item flex-shrink-0 w-72 mr-4 p-4 bg-gradient-to-tr from-blue-600 via-blue-200 to-blue-500 rounded-md hover:scale-105 shadow-xl">
            <h3 className="text-xl font-bold mb-2 text-center text-white">{game.id}</h3>
            <p className="text-gray-200 font-medium text-center">Result: {game.result}</p>
          </div>
        ))
      ) : (
        <div className="flex justify-center items-center w-full h-full my-8">
          <p className="text-xl font-bold text-gray-600">Results will be announced at 12 PM</p>
        </div>
      )}
    </div>
  );
};

export default LotteryCarousel;