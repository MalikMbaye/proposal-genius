import { useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
  delay: number;
  duration: number;
  shape: 'square' | 'circle' | 'triangle' | 'star';
}

interface DeckRevealConfettiProps {
  isActive: boolean;
  onComplete?: () => void;
}

const CONFETTI_COLORS = [
  '#FFD700', // Gold
  '#FF6B6B', // Coral
  '#4ECDC4', // Teal
  '#A855F7', // Purple
  '#3B82F6', // Blue
  '#F97316', // Orange
  '#10B981', // Emerald
  '#EC4899', // Pink
  '#FBBF24', // Amber
  '#06B6D4', // Cyan
];

const SHAPES = ['square', 'circle', 'triangle', 'star'] as const;

export function DeckRevealConfetti({ isActive, onComplete }: DeckRevealConfettiProps) {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [showGlow, setShowGlow] = useState(false);

  const generateConfetti = useCallback(() => {
    const pieces: ConfettiPiece[] = [];
    const numPieces = 150; // More pieces for epic effect

    for (let i = 0; i < numPieces; i++) {
      pieces.push({
        id: i,
        x: 50 + (Math.random() - 0.5) * 20, // Start near center
        y: 50 + (Math.random() - 0.5) * 10,
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 1,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        delay: Math.random() * 0.3,
        duration: 2 + Math.random() * 2,
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      });
    }

    setConfetti(pieces);
  }, []);

  useEffect(() => {
    if (isActive) {
      setShowGlow(true);
      generateConfetti();

      // Clean up after animation
      const timeout = setTimeout(() => {
        setConfetti([]);
        setShowGlow(false);
        onComplete?.();
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [isActive, generateConfetti, onComplete]);

  if (!isActive && confetti.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {/* Central glow burst */}
      {showGlow && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute w-[200vmax] h-[200vmax] animate-glow-burst">
            <div className="absolute inset-0 bg-gradient-radial from-primary/30 via-primary/10 to-transparent rounded-full" />
          </div>
        </div>
      )}

      {/* Confetti pieces */}
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti-burst"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            '--confetti-rotation': `${piece.rotation}deg`,
            '--confetti-scale': piece.scale,
            '--confetti-delay': `${piece.delay}s`,
            '--confetti-duration': `${piece.duration}s`,
            '--confetti-x': `${(Math.random() - 0.5) * 200}vw`,
            '--confetti-y': `${50 + Math.random() * 100}vh`,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
          } as React.CSSProperties}
        >
          {piece.shape === 'square' && (
            <div
              className="w-3 h-3 md:w-4 md:h-4"
              style={{ backgroundColor: piece.color, transform: `scale(${piece.scale})` }}
            />
          )}
          {piece.shape === 'circle' && (
            <div
              className="w-3 h-3 md:w-4 md:h-4 rounded-full"
              style={{ backgroundColor: piece.color, transform: `scale(${piece.scale})` }}
            />
          )}
          {piece.shape === 'triangle' && (
            <div
              className="w-0 h-0"
              style={{
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderBottom: `14px solid ${piece.color}`,
                transform: `scale(${piece.scale})`,
              }}
            />
          )}
          {piece.shape === 'star' && (
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 md:w-5 md:h-5"
              style={{ fill: piece.color, transform: `scale(${piece.scale})` }}
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          )}
        </div>
      ))}

      {/* Sparkle bursts at random positions */}
      {showGlow && (
        <>
          {[...Array(8)].map((_, i) => (
            <div
              key={`sparkle-${i}`}
              className="absolute animate-sparkle-burst"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                animationDelay: `${i * 0.1}s`,
              }}
            >
              <svg viewBox="0 0 24 24" className="w-8 h-8 md:w-12 md:h-12 text-primary">
                <path
                  fill="currentColor"
                  d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"
                />
              </svg>
            </div>
          ))}
        </>
      )}

      <style>{`
        @keyframes confetti-burst {
          0% {
            transform: translate(0, 0) rotate(0deg) scale(0);
            opacity: 1;
          }
          10% {
            transform: translate(0, 0) rotate(90deg) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(var(--confetti-x), var(--confetti-y)) rotate(720deg) scale(0.5);
            opacity: 0;
          }
        }

        @keyframes glow-burst {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }

        @keyframes sparkle-burst {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: scale(1.5) rotate(180deg);
            opacity: 1;
          }
          100% {
            transform: scale(0) rotate(360deg);
            opacity: 0;
          }
        }

        .animate-confetti-burst {
          animation: confetti-burst var(--confetti-duration) cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .animate-glow-burst {
          animation: glow-burst 1.5s ease-out forwards;
        }

        .animate-sparkle-burst {
          animation: sparkle-burst 0.8s ease-out forwards;
        }

        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-from), var(--tw-gradient-via), var(--tw-gradient-to));
        }
      `}</style>
    </div>
  );
}
