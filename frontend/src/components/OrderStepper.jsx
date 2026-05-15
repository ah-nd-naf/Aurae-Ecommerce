import React from 'react';
import { Clock, Package, Truck, ShieldCheck } from 'lucide-react';

/**
 * OrderStepper Component
 * High-contrast version for maximum visibility against white backgrounds.
 */
const OrderStepper = ({ currentStatus }) => {
  const stages = [
    { id: 'PENDING', label: 'Confirmed', icon: Clock },
    { id: 'PROCESSING', label: 'Preparing', icon: Package },
    { id: 'SHIPPED', label: 'In Transit', icon: Truck },
    { id: 'DELIVERED', label: 'Arrived', icon: ShieldCheck },
  ];

  const currentStep = stages.findIndex(s => s.id === currentStatus);
  
  return (
    <div className="w-full py-10 px-4">
      <div className="relative flex justify-between">
        
        {/* --- Track Logic (Boosted Contrast) --- */}
        {/* New Base Track: Solid black background for visibility */}
        <div className="absolute top-1/2 left-0 w-full h-[3px] bg-black -translate-y-1/2 z-0 rounded-full"></div>
        
        {/* Active Progress Line: White on Black */}
        <div 
          className="absolute top-1/2 left-0 h-[3px] bg-white -translate-y-1/2 z-0 transition-all duration-1000 ease-out rounded-full"
          style={{ width: `${(currentStep / (stages.length - 1)) * 100}%` }}
        ></div>

        {/* --- Step Logic --- */}
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          const isCompleted = index <= currentStep;
          const isCurrent = index === currentStep;

          return (
            <div key={stage.id} className="relative z-10 flex flex-col items-center">
              
              {/* Node Styling */}
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center transition-all duration-700
                ${isCompleted ? 'bg-black text-white' : 'bg-gray-100 text-gray-500 border border-gray-200'}
                ${isCurrent ? 'ring-4 ring-gray-200' : ''}
              `}>
                {/* Always show the full icon, just change color */}
                <Icon size={16} className={`${isCompleted ? 'text-white' : 'text-gray-500'}`} />
              </div>

              {/* Label Styling (Maximum Contrast) */}
              <p className={`
                absolute -bottom-8 text-[10px] uppercase tracking-[0.3em] font-bold whitespace-nowrap transition-colors
                ${isCompleted ? 'text-gray-900' : 'text-gray-700'} 
              `}>
                {stage.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStepper;