import { useRef } from 'react';
import { Download, Crown, Wifi } from 'lucide-react';
import { toPng } from 'html-to-image';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface IdentityCardProps {
  name: string;
  userCode: string;
  starRating: number;
  totalAchievements: number;
}

export function IdentityCard({ name, userCode, starRating, totalAchievements }: IdentityCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Format user code like a card number (groups of 4)
  const formatUserCode = (code: string) => {
    const paddedCode = code.padStart(16, '0');
    return paddedCode.match(/.{1,4}/g)?.join(' ') || code;
  };

  const currentYear = new Date().getFullYear();

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 3,
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
        className="relative w-full max-w-md mx-auto overflow-hidden"
        style={{
          aspectRatio: '1.586/1', // Standard card ratio
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 60px rgba(59, 130, 246, 0.1)',
        }}
      >
        {/* Diagonal Stripe Pattern */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 10px,
              rgba(255,255,255,0.1) 10px,
              rgba(255,255,255,0.1) 11px
            )`,
          }}
        />
        
        {/* Top Border Glow */}
        <div 
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background: 'linear-gradient(90deg, transparent, hsl(var(--primary)), transparent)',
          }}
        />

        {/* Content */}
        <div className="relative h-full p-6 flex flex-col justify-between">
          {/* Header Row */}
          <div className="flex items-start justify-between">
            {/* Brand Logo */}
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(210 100% 50%) 100%)',
                  boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
                }}
              >
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 
                  className="text-xl font-bold tracking-wide"
                  style={{ 
                    background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, #60a5fa 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  SKYLINE
                </h3>
                <p className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                  Elite Member
                </p>
              </div>
            </div>
            
            {/* NFC Icon */}
            <div className="flex flex-col items-center gap-1">
              <Wifi className="w-6 h-6 text-muted-foreground rotate-90" />
              <span className="text-[8px] text-muted-foreground tracking-wider">NFC</span>
            </div>
          </div>

          {/* Chip */}
          <div 
            className="w-12 h-9 rounded-md mt-2"
            style={{
              background: 'linear-gradient(135deg, #d4af37 0%, #f5d061 30%, #d4af37 60%, #b8941f 100%)',
              boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.3), inset 0 -1px 2px rgba(0,0,0,0.2)',
            }}
          >
            <div className="w-full h-full grid grid-cols-3 grid-rows-2 gap-[1px] p-[2px]">
              {[...Array(6)].map((_, i) => (
                <div 
                  key={i} 
                  className="rounded-[1px]"
                  style={{
                    background: 'linear-gradient(135deg, #c9a227 0%, #dfc35a 100%)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Member ID */}
          <div className="mt-4">
            <p className="text-[10px] tracking-[0.15em] text-muted-foreground uppercase mb-1">
              Member ID
            </p>
            <p 
              className="text-xl font-mono font-semibold tracking-[0.1em]"
              style={{ 
                color: 'hsl(var(--foreground))',
                textShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
              }}
            >
              {formatUserCode(userCode)}
            </p>
          </div>

          {/* Bottom Row */}
          <div className="flex items-end justify-between mt-auto pt-2">
            {/* Card Holder */}
            <div>
              <p className="text-[10px] tracking-[0.15em] text-muted-foreground uppercase mb-1">
                Card Holder
              </p>
              <p className="text-sm font-semibold tracking-wide uppercase text-foreground">
                {name}
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-6">
              <div className="text-right">
                <p className="text-[10px] tracking-[0.15em] text-muted-foreground uppercase mb-1">
                  Rating
                </p>
                <p 
                  className="text-sm font-bold"
                  style={{ 
                    background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, #60a5fa 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {starRating.toFixed(1)}★
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] tracking-[0.15em] text-muted-foreground uppercase mb-1">
                  Since
                </p>
                <p className="text-sm font-bold text-foreground">
                  {currentYear}
                </p>
              </div>
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
