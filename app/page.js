import Image from "next/image";
import Link from "next/link";
import Header from "./components/Header"

import Banner from "./components/Banner"
import RecentNewsSlider from "./components/RecentNewsSlider"
import TrendingProducts from "./components/TrendingProducts"
import HomePage from "./products/page";
  
export default function Home() {
  return (
    <>
    <Header/>
    <HomePage/>
    <TrendingProducts/>
  
    <Banner/>
    <RecentNewsSlider/>
   
    </>
  );
}