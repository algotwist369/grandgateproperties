import React, { memo } from 'react'

const Button = memo(({
  text,
  children,
  variant = 'primary',
  primaryBg = 'bg-[#996515]',
  primaryText = 'text-gray-300',
  secondaryBg = 'bg-gray-400',
  secondaryText = 'text-gray-400',
  fullWidth = false,
  rounded = 'rounded-md',
  size = 'p-3 text-[16px]',
  className = '',
  ...rest
}) => {
  const content = children ?? text
  const variantClasses = variant === 'secondary'
    ? `bg-transparent border ${secondaryText} border-gray-400 hover:border-[#BD9B5F] transition-colors duration-200`
    : `${primaryBg} ${primaryText} hover:opacity-90 transition-opacity duration-200`
  const widthClass = fullWidth ? 'w-full' : 'w-auto'

  return (
    <button
      className={`${variantClasses} ${size} ${widthClass} ${rounded} ${className} font-medium focus:outline-none focus:ring-2 focus:ring-[#BD9B5F] focus:ring-offset-2 focus:ring-offset-transparent`.trim()}
      {...rest}
    >
      {content}
    </button>
  )
});

Button.displayName = 'Button';

export default Button