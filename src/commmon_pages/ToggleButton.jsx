import React from 'react';

const ToggleButton = ({ checked, onChange, label }) => {
    return (
        <div className="flex items-center cursor-pointer" onClick={() => onChange(!checked)}>
            <div className={`
        relative w-11 h-6 rounded-full transition-colors duration-300 ease-in-out
        ${checked ? 'bg-[#BD9B5F]' : 'bg-[#333]'}
      `}>
                <div className={`
          absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ease-in-out
          ${checked ? 'translate-x-5' : 'translate-x-0'}
        `} />
            </div>
            {label && <span className="ml-3 text-sm font-medium text-gray-300">{label}</span>}
        </div>
    );
};

export default ToggleButton;
