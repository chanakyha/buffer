import Footertrack from "@/components/Footertrack";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import LiveCarousel from "@/components/LiveCarousel";
import ShowAllUsers from "@/components/ShowAllUsers";
import ShowStreamers from "@/components/ShowStreamers";

export default async function Home() {
  return (
    <main className="w-full">
      <Hero/>
      <ShowStreamers/>
      <LiveCarousel/>
      <ShowAllUsers />
      <Footertrack/>
    </main>
  );
}
