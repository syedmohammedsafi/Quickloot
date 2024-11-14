import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const carouselImages: string[] = [
    'https://www.lotto247.com/cms/wp-content/uploads/2023/08/L247-BUTTON-1-casino.png',
    'https://www.lotto247.com/cms/wp-content/uploads/2023/08/L247-BUTTON-4-lottery.png',
    'https://www.lotto247.com/cms/wp-content/uploads/2023/08/L247-BUTTON-2-games.png',
    'https://www.lotto247.com/cms/wp-content/uploads/2023/08/L247-BUTTON-5-my-offers.png',
    'https://www.lotto247.com/cms/wp-content/uploads/2023/08/L247-BUTTON-3-instalotto.png'
  ];

  const [current, setCurrent] = useState<number>(0);
  const length: number = carouselImages.length;
  const navigate = useNavigate();

  useEffect(() => {
    const nextSlide = () => {
      setCurrent((prev) => (prev === length - 1 ? 0 : prev + 1));
    };

    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, [length]);

  const clickPlay = () => {
    navigate('/Monthly/MintedMillions');
  };

  return (
    <section className='w-full center'>
      <div className="hero w-full ml-1 flex flex-col items-center justify-center md:h-96 lg:h-128">
        <div className="Image relative w-full h-48 md:h-96">
          {carouselImages.map((image, index) => (
            <div
              key={index}
              className={`inner absolute w-full h-full bg-no-repeat bg-center bg-cover ${index === current ? 'opacity-100' : 'opacity-0'}`}
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                transition: 'opacity 1s'
              }}>
              <div className="overlay absolute inset-0 ">
                <div className="content absolute inset-0 flex flex-col items-center justify-center text-white text-center">
                  <div className="flex flex-col items-center justify-center">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">Win Big and Become a Millionaire Today</h1>
                    <button onClick={clickPlay} className="play bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 md:py-3 md:px-6 rounded-lg">Play Now</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
