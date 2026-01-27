import { useRef } from 'react';
import { Download, Star } from 'lucide-react';
import { toPng } from 'html-to-image';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/StarRating';
import { toast } from 'sonner';

interface IdentityCardProps {
  name: string;
  userCode: string;
  starRating: number;
  totalAchievements: number;
}

export function IdentityCard({ name, userCode, starRating, totalAchievements }: IdentityCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#0a0a1a',
      });
      
      const link = document.createElement('a');
      link.download = `skyline-${userCode}.png`;
      link.href = dataUrl;
      link.click();
      toast.success('Identity card downloaded!');
    } catch (error) {
      toast.error('Failed to download card');
    }
  };

  return (
    <div className="space-y-4">
      <div
        ref={cardRef}
        className="relative w-full max-w-md mx-auto aspect-[1.6/1] rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--card)) 0%, hsl(220 30% 8%) 50%, hsl(var(--card)) 100%)',
          border: '2px solid hsl(var(--primary) / 0.3)',
        }}
      >
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
        />
        
        {/* Gold Gradient Border Effect */}
        <div className="absolute top-0 left-0 right-0 h-1 gold-gradient" />
        <div className="absolute bottom-0 left-0 right-0 h-1 gold-gradient" />
        
        {/* Content */}
        <div className="relative h-full p-6 flex flex-col justify-between">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center">
                <Star className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold gold-text">SkyLine</span>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Member ID</p>
              <p className="text-sm font-mono font-bold text-primary">{userCode}</p>
            </div>
          </div>
          
          {/* Main Info */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">{name}</h2>
            <StarRating rating={starRating} size="lg" />
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Total Achievements</p>
              <p className="text-lg font-bold">{totalAchievements}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Star Rating</p>
              <p className="text-lg font-bold gold-text">{starRating.toFixed(1)} / 7.0</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center">
        <Button onClick={handleDownload} variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Download as PNG
        </Button>
      </div>
    </div>
  );
}
