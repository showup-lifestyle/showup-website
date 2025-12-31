interface StepCardProps {
  step: number;
  title: string;
  description: string;
  details?: string[];
}

export function StepCard({ step, title, description, details }: StepCardProps) {
  return (
    <div className="p-6 neumorphic-inset max-w-md mx-auto rounded-lg animate-fade-in-up">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-2xl">
          {step}
        </div>
        <h3 className="text-3xl font-serif font-semibold mb-4">{title}</h3>
        <p className="text-lg text-muted-foreground mb-4">{description}</p>
        {details && (
          <ul className="text-left text-base space-y-2">
            {details.map((detail, index) => (
              <li key={index} className="flex items-start">
                <span className="text-primary mr-2 text-2xl">•</span>
                {detail}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}