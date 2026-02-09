import React, { forwardRef } from 'react';

const Input = forwardRef(({
    label,
    type = 'text',
    name,
    value,
    onChange,
    placeholder = '',
    error,
    className = '',
    disabled = false,
    required = false,
    icon,
    ...props
}, ref) => {
    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">{icon}</span>
                    </div>
                )}
                <input
                    ref={ref}
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    placeholder={placeholder}
                    className={`
            block w-full rounded-lg 
            bg-[#1a1a1a] border 
            ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-[#333] focus:border-[#BD9B5F] focus:ring-[#BD9B5F]'} 
            text-white placeholder-gray-500
            focus:outline-none focus:ring-1 
            transition-colors duration-200
            ${icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-500 animate-fade-in">{error}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
