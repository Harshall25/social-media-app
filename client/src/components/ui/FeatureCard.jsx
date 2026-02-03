import { Card, CardContent } from './Card';

export function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  delay = 0 
}) {
  return (
    <Card 
      className="text-center scale-in h-full" 
      style={{animationDelay: `${delay}s`}}
    >
      <CardContent>
        <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-5">
          <Icon className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
        <p className="text-gray-400 leading-relaxed text-sm">{description}</p>
      </CardContent>
    </Card>
  );
}