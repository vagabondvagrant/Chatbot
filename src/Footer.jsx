import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8">
      <div className="container mx-auto px-4 text-center">
        <p className="text-lg mb-2">Made with ❤️ by Kabeer</p>
        <p className="text-sm">© {new Date().getFullYear()} Echo Text Saver App. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
