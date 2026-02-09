import React from 'react';

const Button = ({
    children,
    onClick,
    type = 'button',
    variant = 'primary', // primary, secondary, outline, danger
    size = 'md', // sm, md, lg
    className = '',
    disabled = false,
    isLoading = false,
    fullWidth = false,
}) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-[#BD9B5F] hover:bg-[#a68650] text-white focus:ring-[#BD9B5F]',
        secondary: 'bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white focus:ring-[#1a1a1a] border border-[#333]',
        outline: 'bg-transparent border border-[#BD9B5F] text-[#BD9B5F] hover:bg-[#BD9B5F] hover:text-white focus:ring-[#BD9B5F]',
        danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
        ghost: 'bg-transparent hover:bg-[#1a1a1a] text-gray-300 hover:text-white',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    return (
        <button
            type={type}
            className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
            onClick={onClick}
            disabled={disabled || isLoading}
        >
            {isLoading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : null}
            {children}
        </button>
    );
};

export default Button;
