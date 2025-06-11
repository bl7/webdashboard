import React from "react";
import { Printer } from "lucide-react";

interface Props {
  printsUsed: number;
  maxPrintsPerWeek: number;

}

export default function FreePrintsLeft({
  printsUsed,
  maxPrintsPerWeek,
  
}: Props) {
  const printsLeft = maxPrintsPerWeek - printsUsed;
  const usagePercentage = Math.min(
    (printsUsed / maxPrintsPerWeek) * 100,
    100
  );

  return (
   <div className="relative w-80 h-auto rounded-xl text-black p-4 shadow-lg flex items-center bg-white">
  {/* Icon on the Left */}
  <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mr-4">
    <Printer className="w-6 h-6 text-gray-600" />
  </div>

  {/* Text and Progress on the Right */}
  <div className="flex-1">
    <div className="text-xs opacity-75 mb-1">Free Prints Left</div>
    <div className="text-3xl font-bold">{printsLeft} / {maxPrintsPerWeek}</div>
    <div className="w-full bg-gray-200 h-2 rounded-full mt-2 relative overflow-hidden">
      <div
        className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${usagePercentage}%` }}
      ></div>
    </div>
  </div>
</div>

  );
}
