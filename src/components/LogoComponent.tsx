"use client";

interface LogoComponentProps {
  size?: "small" | "medium" | "large";
  showText?: boolean;
  color?: string;
}

export function LogoComponent({
  size = "medium",
  showText = true,
  color,
}: LogoComponentProps) {
  const logoSizes = {
    small: "h-4 w-4",
    medium: "h-6 w-6",
    large: "h-8 w-8",
  };

  const textColorClass = color ? "" : "text-gray-700";

  const textStyle = color ? { color: `#${color}` } : {};

  return (
    <div className="flex items-center">
      <img
        src="https://media.bananacrystal.com/wp-content/uploads/2024/07/24181620/Logo-128x128-2.png"
        alt="BananaCrystal"
        className={`${logoSizes[size]} mr-1`}
      />
      {showText && (
        <span className={`${textColorClass} font-medium`} style={textStyle}>
          BananaCrystal
        </span>
      )}
    </div>
  );
}
