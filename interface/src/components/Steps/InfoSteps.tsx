// React
import React from "react";

type InfoStepsProps = { steps: any };

export default function InfoSteps({ steps }: InfoStepsProps) {
  return (
    <nav aria-label="Progress">
      <ol
        role="list"
        className="space-y-4 md:flex md:space-x-8 md:space-y-0 mt-14"
      >
        {steps.map((step: any) => (
          <li key={step.name} className="md:flex-1">
            {step.status === "complete" ? (
              <div className="group flex flex-col border-l-4 border-secondary py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                <span className="text-sm font-medium text-secondary ">
                  {step.id}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </div>
            ) : step.status === "current" ? (
              <div
                className="flex flex-col border-l-4 border-main py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                aria-current="step"
              >
                <span className="text-sm font-medium text-main">{step.id}</span>
                <span className="text-sm font-medium">{step.name}</span>
              </div>
            ) : (
              <div className="group flex flex-col border-l-4 border-gray-200 py-2 pl-4 hover:border-gray-300 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
                  {step.id}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
