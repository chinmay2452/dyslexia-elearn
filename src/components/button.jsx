import React from 'react';
import PropTypes from 'prop-types';

export default function Button({ children, onClick, type = "button", variant = "primary" }) {
  const baseStyles = "px-4 py-2 rounded-2xl font-semibold focus:outline-none focus:ring-2 transition-all duration-200";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-400",
    secondary: "bg-gray-200 text-black hover:bg-gray-300 focus:ring-gray-400",
    accent: "bg-yellow-400 text-black hover:bg-yellow-500 focus:ring-yellow-300"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]}`}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  variant: PropTypes.oneOf(["primary", "secondary", "accent"])
};