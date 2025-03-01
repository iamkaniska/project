import React from 'react';

const Footer = () => {
  return (
    <footer className="footer bg-dark py-1">
      <div className="container">
        <p className="text-center text-light">
          &copy; {new Date().getFullYear()} InterviewPrep Platform
        </p>
      </div>
    </footer>
  );
};

export default Footer;