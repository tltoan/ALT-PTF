import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import tigerIcon from '../assets/icons/tiger0.png';
import pinIcon from '../assets/icons/pin1.png';
import anchorIcon from '../assets/icons/anchor2.png';
import profileImage from '../assets/images/profile.jpeg';

const Home = () => {
  const navigate = useNavigate();
  const [isProfileExpanded, setIsProfileExpanded] = useState(false);

  return (
    <div className="min-h-screen lg:h-screen bg-[#FFFBF0] flex flex-col font-sans relative overflow-y-auto lg:overflow-hidden">
      
      {/* Top Navigation */}
      <div className="w-full flex justify-center pt-6 md:pt-8 z-20 shrink-0">
        <nav className="flex items-center gap-6 text-[#4F46E5] font-mono text-xs tracking-widest uppercase">
          <span className="font-bold border-b-2 border-[#4F46E5] pb-1 cursor-default">Home</span>
          <span className="text-gray-400">/</span>
          <div className="relative flex flex-col items-center group">
            <span className="text-gray-400 cursor-not-allowed line-through decoration-2 decoration-[#4F46E5]/40">Blog</span>
            <span className="absolute top-full mt-1 text-[8px] text-[#4F46E5] italic lowercase tracking-normal whitespace-nowrap">coming soon</span>
          </div>
          <span className="text-gray-400">/</span>
          <div className="relative flex flex-col items-center group">
            <span className="text-gray-400 cursor-not-allowed line-through decoration-2 decoration-[#4F46E5]/40">Media</span>
            <span className="absolute top-full mt-1 text-[8px] text-[#4F46E5] italic lowercase tracking-normal whitespace-nowrap">coming soon</span>
          </div>
        </nav>
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 px-6 md:px-12 pt-4 lg:pt-6 pb-12 lg:pb-4 h-full items-start">
        
        {/* Left Column: Intro & Links (3 cols) */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#4F46E5] italic tracking-wide mb-1">
              Antony L. Tran
            </h1>
            <p className="text-gray-400 font-mono text-xs">
              &lt;/p&gt; Hello World &lt;/p&gt;
            </p>
          </div>

          <div className="max-w-md">
             <h2 className="text-lg font-bold italic text-[#4F46E5] mb-2 font-mono">About</h2>
             <div className="text-gray-600 font-mono text-[13px] leading-relaxed space-y-2">
                <p>
                  <div 
                    className="w-24 h-24 float-left mr-4 mb-1 rounded-[4px] overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setIsProfileExpanded(true)}
                  >
                    <img 
                      src={profileImage} 
                      alt="Antony Tran" 
                      className="w-full h-full object-cover scale-150"
                    />
                  </div>
                  Hey, I'm Antony, or Ant. I'm 20, studying Computer Science and Interactive Media & Design at UNC Chapel Hill. I'm passionate about where art and technology intersect and learning new things. I’m currently working on my first gallery exhibit, I have 2/13 pieces for this collection, I am also researching translation of EEG signals (brain activity) into images.
                </p>
                <p>
                  Right now, I'm focused on learning as much as I can, meeting people across different disciplines, and exploring interests outside my own bubble. I believe technology is one of humanity's greatest gifts, but only when it's rooted in genuine human experience. That's why I'm constantly moving between building (startups, research, design) and experiencing (travel, art, conversations), I want to create tech that actually serves people, not just solves problems on paper, and if not, learning to better myself is enough for me.
                </p>
             </div>
          </div>

          <div className="max-w-md mt-2">
             <h2 className="text-lg font-bold italic text-[#4F46E5] mb-2 font-mono">Quick Links</h2>
             <div className="flex flex-wrap gap-3 text-[13px] font-mono text-gray-600">
                <a href="mailto:antonyltran@gmail.com" className="hover:text-[#4F46E5] transition-colors">Mail</a>
                <a href="https://www.instagram.com/a.einz/" target="_blank" rel="noopener noreferrer" className="hover:text-[#4F46E5] transition-colors">Instagram</a>
                <a href="https://www.linkedin.com/in/antonytran05/" target="_blank" rel="noopener noreferrer" className="hover:text-[#4F46E5] transition-colors">LinkedIn</a>
                <a href="https://github.com/tltoan" target="_blank" rel="noopener noreferrer" className="hover:text-[#4F46E5] transition-colors">Github</a>
                <a href="https://substack.com/@antonylt?" target="_blank" rel="noopener noreferrer" className="hover:text-[#4F46E5] transition-colors">Substack</a>
             </div>
          </div>
        </div>

        {/* Middle Column: Currently (4 cols) */}
        <div className="lg:col-span-4 flex flex-col pt-1 lg:pl-4">
           <h2 className="text-lg font-bold italic text-[#4F46E5] mb-4 font-mono">Currently</h2>
           <div className="text-gray-600 font-mono text-[13px] leading-relaxed space-y-4 lg:max-h-[70vh] lg:overflow-y-auto pr-2 scrollbar-hide">
              
              {/* Reading */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-gray-400 block border-b border-gray-100 pb-1">Reading</span>
                <div className="flex gap-4">
                  <div className="flex-1 flex gap-2">
                     <img 
                        src="https://covers.openlibrary.org/b/isbn/9780394404288-M.jpg" 
                        alt="The Prophet" 
                        className="w-10 h-16 object-cover shadow-sm rounded-sm"
                     />
                     <div>
                        <p className="font-semibold">The Prophet</p>
                        <p className="text-[10px] italic opacity-80 mb-0.5">Khalil Gibran</p>
                        <p className="text-[10px] italic opacity-80">Timeless wisdom on the human condition.</p>
                     </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 flex gap-2">
                     <img 
                        src="https://covers.openlibrary.org/b/isbn/9780141439518-M.jpg" 
                        alt="Pride and Prejudice" 
                        className="w-10 h-16 object-cover shadow-sm rounded-sm"
                     />
                     <div>
                        <p className="font-semibold">Pride & Prejudice</p>
                        <p className="text-[10px] italic opacity-80 mb-0.5">Jane Austen</p>
                        <p className="text-[10px] italic opacity-80">A witty exploration of love and social standing.</p>
                     </div>
                  </div>
                </div>
              </div>

              {/* Listening */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-gray-400 block border-b border-gray-100 pb-1">Listening</span>
                <ul className="space-y-1">
                  <li>Fred again.. - USB02</li>
                  <li>The Favors - the little mess you made</li>
                  <li>2hollis - cliche</li>
                </ul>
              </div>

              {/* Working On */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-gray-400 block border-b border-gray-100 pb-1">Working On</span>
                <ul className="space-y-1 list-disc list-inside opacity-90">
                    <li>EEG -&gt; Image Generation</li>
                    <li>Anchor : consumer start-up (dating space)</li>
                    <li>My first artist collection (featured in gallery)</li>
                    <li>Trying to lean bulk before Spring Break</li>
                    <li>Getting my mile down to 8 minutes</li>
                    <li>Planning start-up documentary in London + Madrid ('the kids are going to be alright')</li>
                </ul>
              </div>
           </div>
        </div>


        {/* Right Column: Trinkets (4 cols) */}
        <div className="lg:col-span-4 flex flex-col relative h-full lg:min-h-0 min-h-[300px]">
          <h2 className="text-lg font-bold italic text-[#4F46E5] mb-4 font-mono pt-1">Current Trinkets</h2>
          
          <div className="relative w-full flex-1 flex items-center justify-center">
            
            {/* Tiger Icon (.01) */}
            <div 
              className="absolute top-[35%] left-[30%] transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 flex flex-col items-center group"
              onClick={() => navigate('/tiger')}
            >
              <div className="relative">
                <div className="absolute -top-8 -right-12 flex flex-col items-start min-w-[80px]">
                    <span className="text-[#4F46E5] font-bold text-[10px] bg-[#FFFBF0] px-1 rounded">.01</span>
                    <span className="text-[10px] font-mono text-gray-600 whitespace-nowrap bg-[#FFFBF0]/80 px-1 rounded">"con cop"</span>
                </div>
                <img src={tigerIcon} alt="Tiger" className="w-20 md:w-24 drop-shadow-lg rounded-[5px] transition-transform duration-300 group-hover:scale-110" />
              </div>
            </div>

            {/* Pin Icon (.02) */}
            <a 
              href="https://www.get-pins.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-[35%] right-[25%] transform translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 flex flex-col items-center group"
            >
              <div className="relative">
                <div className="absolute -top-8 -right-12 flex flex-col items-start min-w-[80px]">
                    <span className="text-[#4F46E5] font-bold text-[10px] bg-[#FFFBF0] px-1 rounded">.02</span>
                    <span className="text-[10px] font-mono text-gray-600 whitespace-nowrap bg-[#FFFBF0]/80 px-1 rounded">make a pin</span>
                </div>
                <img src={pinIcon} alt="Pin" className="w-16 md:w-20 drop-shadow-lg transform rotate-12 rounded-[5px] transition-transform duration-300 group-hover:scale-110" />
              </div>
            </a>

            {/* Anchor Icon (.03) */}
            <a 
              href="https://www.anchor.dating/"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-[60%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 flex flex-col items-center group"
            >
              <div className="relative">
                 <div className="absolute -top-8 -right-12 flex flex-col items-start min-w-[60px]">
                    <span className="text-[#4F46E5] font-bold text-[10px] bg-[#FFFBF0] px-1 rounded">.03</span>
                    <span className="text-[10px] font-mono text-gray-600 whitespace-nowrap bg-[#FFFBF0]/80 px-1 rounded">anchor</span>
                 </div>
                 <img src={anchorIcon} alt="Anchor" className="w-20 md:w-24 drop-shadow-lg rounded-[5px] transition-transform duration-300 group-hover:scale-110" />
              </div>
            </a>

          </div>
        </div>

      </div>

      {/* Profile Image Modal */}
      {isProfileExpanded && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setIsProfileExpanded(false)}
        >
          <div className="max-w-2xl w-full max-h-[90vh] flex flex-col items-center">
            <img 
              src={profileImage} 
              alt="Antony Tran" 
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()} 
            />
            <button 
              className="mt-4 text-white font-mono text-sm hover:underline"
              onClick={() => setIsProfileExpanded(false)}
            >
              [Close]
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
