import { Card, CardContent } from './Card';

export function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  delay = 0 
}) {
  return (
    <Card 
      className="text-center scale-in" 
      style={{animationDelay: `${delay}s`}}
    >
      <CardContent>
        <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Icon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold mb-4 text-white">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}