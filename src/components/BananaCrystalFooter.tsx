import React from "react";
import { LogoComponent } from "./LogoComponent"; // Assuming LogoComponent path

interface BananaCrystalFooterProps {
  // Define any props if needed, currently none
  color?: string; // Assuming LogoComponent accepts a color prop
}

export const BananaCrystalFooter: React.FC<BananaCrystalFooterProps> = ({
  color = "#ffffff",
}) => {
  return (
    <div className="mt-8 pt-6 border-t border-gray-700 text-center">
      <div className="flex justify-center items-center opacity-80 hover:opacity-100 transition-opacity">
        <span className="text-gray-300 text-sm mr-2">Powered by</span>
        <a
          href="https://bananacrystal.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center"
        >
          {/* Pass color prop to LogoComponent if it supports it */}
          <LogoComponent color={color} />
        </a>
      </div>
    </div>
  );
};
