"use client";

type StepIndicatorProps = {
  currentStep: number;
};

const steps = ["Profile", "Experience", "Education", "Skill"];

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex flex-col items-center mb-10">
      {/* Step Labels */}
      <div className="flex justify-between w-full max-w-3xl relative">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              {/* Circle Number */}
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full border-2 font-semibold transition-all duration-300
                ${
                  isCompleted
                    ? "bg-blue-600 border-blue-600 text-white"
                    : isActive
                    ? "bg-white border-blue-600 text-blue-600"
                    : "bg-white border-gray-300 text-gray-400"
                }`}
              >
                {stepNumber}
              </div>

              {/* Label */}
              <span
                className={`text-sm mt-2 ${
                  isActive
                    ? "text-blue-600 font-semibold"
                    : isCompleted
                    ? "text-gray-600"
                    : "text-gray-400"
                }`}
              >
                {label}
              </span>

              {/* Connecting line */}   
              {index < steps.length - 1 && (
                <div
                  className={`absolute top-4 w-full h-[2px] left-[50%] -translate-x-[50%] z-[-1]
                    ${isCompleted ? "bg-blue-600" : "bg-gray-300"}
                  `}
                ></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
