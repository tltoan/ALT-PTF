import React from 'react';
import mailIcon from '../assets/icons/mail.png';
import instaIcon from '../assets/icons/ig.png';
import githubIcon from '../assets/icons/git.png';
import substackIcon from '../assets/icons/substack.png';
import linkedinIcon from '../assets/icons/linkedin.png';
import pinIcon from '../assets/icons/pin1.png';

interface QuickLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuickLinksModal: React.FC<QuickLinksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const links = [
    { name: 'Mail', icon: mailIcon, url: 'mailto:antonyltran@gmail.com', description: 'Drop me a line' },
    { name: 'Instagram', icon: instaIcon, url: 'https://www.instagram.com/a.einz/', description: 'Visual diary' },
    { name: 'LinkedIn', icon: linkedinIcon, url: 'https://www.linkedin.com/in/antonytran05/', description: 'Professional' },
    { name: 'Github', icon: githubIcon, url: 'https://github.com/tltoan', description: 'Code & Projects' },
    { name: 'Substack', icon: substackIcon, url: 'https://substack.com/@antonylt?', description: 'My thoughts' },
  ];

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-[#FFFBF0] w-full max-w-md relative animate-slide-up shadow-2xl rounded-sm p-8 border-t-4 border-[#4F46E5]"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black z-10 p-2 text-2xl leading-none"
        >
          ×
        </button>

        <h2 className="text-3xl font-serif font-bold mb-8 text-center text-[#4F46E5] italic tracking-wide">
          Quick Links
        </h2>

        <div className="flex flex-col gap-6">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-6 group p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all"
            >
              <div className="w-12 h-12 flex-shrink-0 relative flex items-center justify-center">
                 <img 
                   src={link.icon} 
                   alt={link.name} 
                   className="w-full h-full object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-300" 
                 />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-serif font-bold text-[#4F46E5] text-xl leading-none mb-1 group-hover:underline">
                  {link.name}
                </span>
                <span className="font-mono text-xs text-gray-500 uppercase tracking-widest">
                  {link.description}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickLinksModal;
