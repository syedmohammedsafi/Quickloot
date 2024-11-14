import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, deleteDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase/Firebase";
import { UserProvider } from './context/UserContext';
import AuthLayout from "./Layout/AuthLayout";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import ForgotPassword from "./Auth/ForgotPassword";
import DefaultLayout from "./Layout/DefaultLayout";
import NotFound from "./Component/Pages/NotFound/NotFound";
import Profile from "./Component/Layout/profile/Profile";
import AdminForm from "./Component/Layout/profile/Admin";
import Recharge from "./Component/Pages/Wallet/Recharge/Recharge";
import Withdrawal from "./Component/Pages/Wallet/withdrawal/Withdrawal";
import FAQSection from "./Component/Layout/FAQ/FAQsection";
import MintedMillions from "./Component/Pages/Game/Monthly/MintedMillions";
import PowerSwipe from "./Component/Pages/Game/Monthly/PowerSwipe";
import KingQueen from "./Component/Pages/Game/Monthly/King&Queen";
import Winfinity from "./Component/Pages/Game/Monthly/Winfinity";
import GoldenBox from "./Component/Pages/Game/Monthly/GoldenBox";
import LotSet from "./Component/Pages/Game/Monthly/LotSet";
import RainbowRise from "./Component/Pages/Game/Monthly/RainbowRise";
import ShiningTreasure from "./Component/Pages/Game/Monthly/ShiningTreasure";
import SilverFoxes from "./Component/Pages/Game/Monthly/SilverFoxes";
import MegaPower from "./Component/Pages/Game/Monthly/MegaPower";
import BallBuster from "./Component/Pages/Game/Daily/BallBuster";
import BetWin from "./Component/Pages/Game/Daily/Bet&Win";
import Bet2nite from "./Component/Pages/Game/Daily/Bet2nite";
import CashCraze from "./Component/Pages/Game/Daily/CashCraze";
import CashSplash from "./Component/Pages/Game/Daily/CashSplash";
import CashWave from "./Component/Pages/Game/Daily/CashWave";
import GoldRush from "./Component/Pages/Game/Daily/GoldRush";
import PocketRocket from "./Component/Pages/Game/Daily/PocketsRockets";
import PrizeParadise from "./Component/Pages/Game/Daily/PrizeParadise";
import TrickShots from "./Component/Pages/Game/Daily/TrickShots";
import VivaVictory from "./Component/Pages/Game/Daily/VivaVictory";
import Cascade from "./Component/Pages/Game/Weekly/Cascade";
import Charmstrike from "./Component/Pages/Game/Weekly/CharmStrike";
import KnockKnock from "./Component/Pages/Game/Weekly/KnockKnock";
import PowerBall from "./Component/Pages/Game/Weekly/PowerBall";
import PowerPlay from "./Component/Pages/Game/Weekly/PowerPlay";
import SyndicateStar from "./Component/Pages/Game/Weekly/SyndicateStar";
import TurkeyShoot from "./Component/Pages/Game/Weekly/TurkeyShoot";
import LotteryResults from "./Component/Pages/result/ResultPage";

function App() {
  const auth = getAuth();

  useEffect(() => {
    const updateDailyDocuments = async () => {
      const dailyDocuments = ["Ball Buster", "Bet & Win", "Bet2nite", "Cash Craze", "Cash Splash", "Cash Wave", "GoldRush", "Pockets Rockets", "Price Paradise", "Trick Shots", "Viva Victory"];
  
      for (const docName of dailyDocuments) {
        const docRef = doc(db, "Daily", docName);
        await deleteDoc(docRef);
        await setDoc(docRef, {});
      }
    };

    const updateWeeklyDocuments = async () => {
      const weeklyDocuments = ["Cascade", "Charmstrike", "Knock Knock", "Power Ball", "Power Play", "Syndicate Star", "Turkey Shoot"];
  
      for (const docName of weeklyDocuments) {
        const docRef = doc(db, "Weekly", docName);
        await deleteDoc(docRef);
        await setDoc(docRef, {});
      }
    };

    const updateDailyAt12PM = () => {
      const now = new Date();
      const targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0);
    
      let delay = targetTime.getTime() - now.getTime();
      if (delay < 0) {
        delay += 24 * 60 * 60 * 1000;
      }
    
      setTimeout(() => {
        updateDailyDocuments();
        setInterval(updateDailyDocuments, 24 * 60 * 60 * 1000);
      }, delay);
    };
    
    const weeklyUpdateAt12PMOnMonday = () => {
      const now = new Date();
      const dayOfWeek = now.getDay();
      const nextMonday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + ((8 - dayOfWeek) % 7), 12, 0, 0);
    
      let delay = nextMonday.getTime() - now.getTime();
      if (delay < 0) {
        delay += 7 * 24 * 60 * 60 * 1000;
      }
    
      setTimeout(() => {
        updateWeeklyDocuments();
        setInterval(updateWeeklyDocuments, 7 * 24 * 60 * 60 * 1000);
      }, delay);
    };

    onAuthStateChanged(auth, (user) => {
      if (user) {
        updateDailyAt12PM();
        weeklyUpdateAt12PMOnMonday();
      }
    });
  }, [auth]);

  return (
    <Router>
      <UserProvider>
        <Routes>
          <Route path="/" element={<AuthLayout />} />
          <Route path="/">
            <Route path="/signup/:referCode" element={<Signup />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="forgotpassword" element={<ForgotPassword />} />
          </Route>

          <Route path="/" element={<DefaultLayout />} />
          <Route path="dashboard" element={<DefaultLayout />} />

          <Route path="/profile" element={<Profile />} />
          <Route path="/results" element={<LotteryResults />} />
          <Route path="/admin/dashboard" element={<AdminForm />} />
          <Route path="/recharge" element={<Recharge />} />
          <Route path="/withdraw" element={<Withdrawal />} />
          <Route path="/faq" element={<FAQSection />} />
          <Route path="/*" element={<NotFound />} />

          <Route path="Monthly/MintedMillions" element={<MintedMillions />} />
          <Route path="Monthly/PowerSwipe" element={<PowerSwipe />} />
          <Route path="Monthly/King&Queen" element={<KingQueen />} />
          <Route path="Monthly/Winfinity" element={<Winfinity />} />
          <Route path="Monthly/Goldenbox" element={<GoldenBox />} />
          <Route path="Monthly/LotSet" element={<LotSet />} />
          <Route path="Monthly/RainbowRise" element={<RainbowRise />} />
          <Route path="Monthly/ShiningTreasure" element={<ShiningTreasure />} />
          <Route path="Monthly/SilverFoxes" element={<SilverFoxes />} />
          <Route path="Monthly/MegaPower" element={<MegaPower />} />

          <Route path="Daily/BallBuster" element={<BallBuster />} />
          <Route path="Daily/BetWin" element={<BetWin />} />
          <Route path="Daily/Bet2nite" element={<Bet2nite />} />
          <Route path="Daily/CashCraze" element={<CashCraze />} />
          <Route path="Daily/CashSplash" element={<CashSplash />} />
          <Route path="Daily/CashWave" element={<CashWave />} />
          <Route path="Daily/GoldRush" element={<GoldRush />} />
          <Route path="Daily/PocketRocket" element={<PocketRocket />} />
          <Route path="Daily/PrizeParadise" element={<PrizeParadise />} />
          <Route path="Daily/TrickShots" element={<TrickShots />} />
          <Route path="Daily/VivaVictory" element={<VivaVictory />} />

          <Route path="Weekly/Cascade" element={<Cascade />} />
          <Route path="Weekly/Charmstrike" element={<Charmstrike />} />
          <Route path="Weekly/KnockKnock" element={<KnockKnock />} />
          <Route path="Weekly/PowerBall" element={<PowerBall />} />
          <Route path="Weekly/PowerPlay" element={<PowerPlay />} />
          <Route path="Weekly/SyndicateStar" element={<SyndicateStar />} />
          <Route path="Weekly/TurkeyShoot" element={<TurkeyShoot />} />
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
