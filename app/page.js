import Image from "next/image";
import Link from "next/link";
import Header from "./components/Header"

import Banner from "./components/Banner"
import RecentNewsSlider from "./components/RecentNewsSlider"
import TrendingProducts from "./components/TrendingProducts"
import HomePage from "./products/page";
import Testimonials from "./components/about/Testimonials";
  
export default function Home() {
  return (
    <>
    <Header/>
    <TrendingProducts/>
    <HomePage/>
  
    <RecentNewsSlider/>
    <Banner/>
    <Testimonials/>
   
    </>
  );
}