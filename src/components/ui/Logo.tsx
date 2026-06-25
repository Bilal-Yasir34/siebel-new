import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Logo({ size = 'md', className = '' }: LogoProps) {
  const heights = {
    sm: 'h-7',
    md: 'h-16',
    lg: 'h-12',
  };

  return (
    <Link to="/" className={`inline-flex items-center ${className}`}>
      <img
        src="/images/siebel-logo.png"
        alt="Siebel Skincare"
        className={`${heights[size]} w-auto object-contain`}
      />
    </Link>
  );
}
