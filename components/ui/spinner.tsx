interface SpinnerProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
}

export function Spinner({ className = '', size = 'md' }: SpinnerProps) {
  return (
    <div
      className={`${sizeClasses[size]} ${className} border-2 border-slate-600 border-t-blue-400 rounded-full animate-spin`}
    />
  )
}
