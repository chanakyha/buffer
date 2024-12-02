'use client'
import Image from "next/image";
import Buffer from "../assets/buffer.png";
import Ellipse from "../assets/Ellipse 13.png";

const Hero = () => {
  return (
    <div className="relative mb-16 w-full h-48 flex flex-col gap-y-4 justify-center items-center">
      {/* Ellipse background */}
      <div className="absolute inset-0 flex justify-center items-center">
        <Image 
          src={Ellipse} 
          alt="ellipse" 
          className="w-full max-w-xl h-auto object-contain opacity-100"
        />
      </div>
      {/* Buffer image */}
      <Image 
        src={Buffer} 
        alt="logoimg" 
        className="relative z-10 w-64 h-20"
      />
      {/* Hero title */}
      <h1 className="relative z-10 text-center font-semibold text-lg">
        The Future of Live Streaming, Decentralized
      </h1>
    </div>
  );
};

export default Hero;
