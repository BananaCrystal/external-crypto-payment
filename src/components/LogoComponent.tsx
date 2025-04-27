// LogoComponent.tsx
"use client";

interface LogoComponentProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

export function LogoComponent({ size = 'medium', showText = true }: LogoComponentProps) {
  const logoSizes = {
    small: "h-4 w-4",
    medium: "h-6 w-6",
    large: "h-8 w-8"
  };
  
  return (
    <div className="flex items-center">
      <img
        src="https://media.bananacrystal.com/wp-content/uploads/2024/07/24181620/Logo-128x128-2.png"
        alt="BananaCrystal"
        className={`${logoSizes[size]} mr-1`}
      />
      {showText && <span className="text-gray-700 font-medium">BananaCrystal</span>}
    </div>
  );
}