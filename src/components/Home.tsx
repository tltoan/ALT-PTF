import React from 'react';
import { useNavigate } from 'react-router-dom';
import tigerIcon from '../assets/icons/tiger0.png';
import pinIcon from '../assets/icons/pin1.png';
import anchorIcon from '../assets/icons/anchor2.png';
import ContactModal from './ContactModal';

const Home = () => {
  const navigate = useNavigate();
  const [isContactModalOpen, setIsContactModalOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#FFFBF0] flex flex-col items-center justify-center relative overflow-hidden font-sans">
      {/* Header */}
      <div className="absolute top-20 left-0 w-full flex justify-center z-10">
        <div className="text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-[#4F46E5] italic tracking-wide mb-2">
            Antony L.
            <br />
            Tran
          </h1>
          <p className="text-gray-400 font-mono text-sm">
            &lt;/p&gt; Hello World &lt;/p&gt;
          </p>
        </div>
      </div>

      {/* Icons Container */}
      <div className="relative w-full max-w-2xl h-[600px] mt-20">
        
        {/* Tiger Icon (.01) */}
        <div 
          className="absolute top-[35%] left-1/4 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110"
          onClick={() => navigate('/tiger')}
        >
          <span className="absolute -top-6 -right-6 text-[#4F46E5] font-bold text-sm">.01</span>
          <img src={tigerIcon} alt="Tiger" className="w-32 md:w-40 drop-shadow-lg" />
        </div>

        {/* Pin Icon (.02) */}
        <a 
          href="https://www.get-pins.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-1/3 right-1/4 transform translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110"
        >
          <span className="absolute -top-6 -right-6 text-[#4F46E5] font-bold text-sm">.02</span>
          <img src={pinIcon} alt="Pin" className="w-24 md:w-32 drop-shadow-lg transform rotate-12" />
        </a>

        {/* Anchor Icon (.03) */}
        <a 
          href="https://www.anchor.dating/"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 translate-y-1/2 cursor-pointer transition-transform hover:scale-110"
        >
          <span className="absolute -top-6 right-0 text-[#4F46E5] font-bold text-sm">.03</span>
          <img src={anchorIcon} alt="Anchor" className="w-32 md:w-40 drop-shadow-lg" />
        </a>

      </div>

      {/* Footer */}
      <div className="absolute bottom-16 left-0 w-full flex justify-center z-10">
        <div className="text-[#4F46E5] font-mono text-sm tracking-wide flex flex-wrap justify-center gap-4 md:gap-8 px-4 text-center">
            <span>1. "con cop" (the tiger)</span>
            <span>2. make a pin</span>
            <span>3. anchor</span>
        </div>
      </div>

      {/* Contact Button */}
      <div className="absolute bottom-6 left-0 w-full flex justify-center z-10">
          <button 
              onClick={() => setIsContactModalOpen(true)}
              className="text-[#4F46E5] font-mono text-sm tracking-wide hover:underline uppercase font-bold"
          >
              Contact
          </button>
      </div>

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
};

export default Home;
