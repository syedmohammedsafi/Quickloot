import React from "react";
import Header from "../Component/Layout/Header/Header";
import Carousal from "../Component/Layout/carousel/Carousal";
import { Outlet } from "react-router-dom";
import LotteryCard from "../Component/Layout/Card/LotteryCard";
import HeroSection from "../Component/Layout/Herosection/HeroSection";
import Footer from "../Component/Layout/footer/Footer";

function DefaultLayout() {
  return (
    <div className="w-full">
      <Header />
      <div className="relative top-24">
        <div className="p-1 mr-2">
          <HeroSection />
        </div>
        <Carousal />
        <LotteryCard />
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default DefaultLayout;
