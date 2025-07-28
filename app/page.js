import Image from "next/image";
import Link from "next/link";
import Header from "./components/Header"
import PopularCategories from "./components/PopularCategories"
import Banner from "./components/Banner"
import RecentNewsSlider from "./components/RecentNewsSlider"
import TrendingProducts from "./components/TrendingProducts"
  
export default function Home() {
  return (
    <>
    <Header/>
    <TrendingProducts/>
    <PopularCategories/>
    <Banner/>
    <RecentNewsSlider/>
   
    </>
  );
}