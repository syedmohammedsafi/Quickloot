import React from 'react';

interface LotteryInfoProps{
  gameName: string 
}

const LotteryInfo: React.FC<LotteryInfoProps>  = ({ gameName }) => {

  return (
    <div className="bg-gray-100 rounded-lg shadow-md p-5 w-[350px] sm:w-max mx-auto">
      <div className="text-center mb-5">
        <h1 className="text-2xl font-bold text-blue-500">Lottery Information</h1>
      </div>
      <div className=" text-center m-5">
        <h3 className="text-lg font-semibold m-5">How to Play { gameName } Online</h3>
        <p>To play the { gameName } lottery online, you must:</p>
        <div className="m-5">
          <h3 className="text-lg font-semibold m-5">Prizes and Rewards</h3>
          <p>If you match all 5 numbers, you win the jackpot! But don&apos;t worry, there are other prizes too:</p>
          <ul className="list-disc list-inside">
            <li>Match 4 numbers and you&apos;ll win a substantial amount.</li>
            <li>Match 3 numbers and you&apos;ll still receive a prize.</li>
            <li>Match 2 numbers and you&apos;ll get a smaller reward.</li>
            <li>Even if you only match 1 number, you&apos;ll still win a prize.</li>
          </ul>
        </div>
        <p>Read our detailed guide on <a href="/" className="text-blue-500 no-underline">How to Play { gameName } online</a> or visit our <a href="/mega-millions-resource-centre" className="text-blue-500 no-underline">{ gameName } Resource Centre</a> for more help with playing the Mega Millions lottery online on Lotto247.</p>
      </div>
    </div>
  );
};

export default LotteryInfo;
