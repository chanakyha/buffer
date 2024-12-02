import Image from 'next/image';
import SuiWallet from '../assets/Sui-wallet 1.png';  // Adjust the import path based on your project structure
import Router from '../assets/router.png';
import Nethermind from '../assets/nethermind.png';
import Marquee from "react-fast-marquee";

const Footertrack = () => {
  return (
    <div className="w-full h-72 flex flex-col justify-center items-center pt-12">
        <h1 className='text-blue-700 text-3xl font-semibold'>Eligible Tracks</h1>
      <div className="flex flex-row gap-x-8 items-center h-full justify-center">
        <Marquee direction="right" speed={50} gradient={false}>
          <div className="flex gap-x-16 items-center">
            <Image 
              src={SuiWallet}
              alt="Sui Wallet logo" 
              className="w-96 h-full mx-8"
            />
            <Image 
              src={Router}
              alt="Router logo" 
              className="w-96 h-full mx-8"
            />
            <Image 
              src={Nethermind}
              alt="Nethermind logo" 
              className="w-96 h-full mx-8"
            />
          </div>
        </Marquee>
      </div>
    </div>
  );
};

export default Footertrack;