import React, { useState } from 'react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    reason: '',
  });
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    console.log('Contact Request:', formData);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 max-w-md w-full text-center relative animate-fade-in shadow-2xl">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-black"
          >
            ✕
          </button>
          <div className="mb-4 text-green-500 text-5xl">✓</div>
          <h2 className="text-2xl font-bold font-serif mb-2">Message Sent</h2>
          <p className="text-gray-600 mb-6">
            Thanks for reaching out, {formData.name}.<br/>
            I'll get back to you shortly.
          </p>
          <button 
            onClick={onClose}
            className="bg-black text-white px-8 py-3 font-bold hover:bg-gray-800 transition-colors uppercase tracking-wider text-sm"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-[#FFFBF0] w-full max-w-lg relative animate-slide-up shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black z-10 p-2"
        >
          ✕
        </button>

        <div className="p-8">
          <h2 className="text-3xl font-serif font-bold mb-6 border-b border-gray-300 pb-4">
            Contact
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Name</label>
              <input
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 p-3 text-sm focus:outline-none focus:border-black transition-colors"
                placeholder="Your Name"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Email</label>
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 p-3 text-sm focus:outline-none focus:border-black transition-colors"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Reason for contact</label>
              <textarea
                required
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows={4}
                className="w-full bg-white border border-gray-300 p-3 text-sm focus:outline-none focus:border-black transition-colors resize-none"
                placeholder="Tell me why you're reaching out..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white font-bold py-4 mt-2 uppercase tracking-widest hover:bg-[#4F46E5] transition-colors duration-300"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
