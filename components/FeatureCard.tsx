interface FeatureCardProps {
  title: string;
  description: string;
}

export function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="p-6 neumorphic max-w-sm mx-auto rounded-lg text-center animate-fade-in-up">
      <h3 className="text-2xl font-serif font-semibold mb-4">{title}</h3>
      <p className="text-lg text-muted-foreground">{description}</p>
    </div>
  );
}