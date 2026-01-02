import React from 'react'

// Map common heading names to Tailwind text size classes
const sizeMap = {
  h1: 'text-[52px]',
  h2: 'text-3xl',
  h3: 'text-2xl',
  h4: 'text-xl',
  h5: 'text-lg',
  h6: 'text-base',
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
}

const Heading = ({
  as: Component = 'div',
  children = 'Heding',
  className = '',
  size, // 'h1' | 'h2' | 'xl' | 'text-3xl' etc.
  color, // 'white' | 'text-white' etc.
  weight = 'font-semibold',
  ...rest
}) => {
  // determine size class
  let sizeClass = ''
  if (size) {
    if (typeof size === 'string' && sizeMap[size]) sizeClass = sizeMap[size]
    else if (typeof size === 'string' && size.startsWith('text-')) sizeClass = size
    else sizeClass = `text-${size}`
  } else {
    sizeClass = 'text-2xl'
  }

  // determine color class
  let colorClass = ''
  if (color) {
    colorClass = typeof color === 'string' && color.startsWith('text-') ? color : `text-${color}`
  }

  const classes = [sizeClass, weight, colorClass, className].filter(Boolean).join(' ').trim()

  return (
    <Component className={classes} {...rest}>
      {children}
    </Component>
  )
}

export default Heading