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
            <div className="group flex flex-col border-l-4 border-main py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-main">{step.id}</span>
              <span className="text-sm font-medium">{step.name}</span>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
