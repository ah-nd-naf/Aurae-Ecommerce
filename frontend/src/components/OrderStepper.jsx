import React from 'react';
import { CheckCircle2, Circle, Truck, PackageCheck, Package, Clock } from 'lucide-react';

const OrderStepper = ({ currentStatus }) => {
  // Define the stages in order
  const stages = [
    { id: 'PENDING', label: 'Ordered', icon: Clock },
    { id: 'PROCESSING', label: 'Processing', icon: Package },
    { id: 'SHIPPED', label: 'Shipped', icon: Truck },
    { id: 'DELIVERED', label: 'Delivered', icon: PackageCheck },
  ];

  // Find the index of the current status to calculate progress
  const currentStep = stages.findIndex(s => s.id === currentStatus);
  
  return (
    <div className="w-full py-8">
      <div className="relative flex justify-between">
        {/* The Background Line */}
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-100 -translate-y-1/2 z-0"></div>
        
        {/* The Progress Line */}
        <div 
          className="absolute top-1/2 left-0 h-[2px] bg-black -translate-y-1/2 z-0 transition-all duration-1000 ease-in-out"
          style={{ width: `${(currentStep / (stages.length - 1)) * 100}%` }}
        ></div>

        {/* The Steps */}
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          const isCompleted = index <= currentStep;
          const isCurrent = index === currentStep;

          return (
            <div key={stage.id} className="relative z-10 flex flex-col items-center group">
              {/* The Circle/Icon */}
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500
                ${isCompleted ? 'bg-black text-white' : 'bg-white border-2 border-gray-100 text-gray-300'}
                ${isCurrent ? 'ring-4 ring-gray-50' : ''}
              `}>
                {isCompleted && index < currentStep ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <Icon size={18} />
                )}
              </div>

              {/* The Label */}
              <p className={`
                absolute -bottom-8 text-[10px] uppercase tracking-widest font-bold whitespace-nowrap transition-colors
                ${isCompleted ? 'text-black' : 'text-gray-300'}
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