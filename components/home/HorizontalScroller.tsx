'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import Button from '../ui/Button';

interface HorizontalScrollerProps {
  children: React.ReactNode;
  onNext?: () => void;
  onPrev?: () => void;
  isFetching?: boolean;
  showArrowsLeft?: boolean;
  showArrowsRight?: boolean;
  scrollAmount?: number; // optional override; defaults to container width
}
function LoadingDots() {
  return (
    <span className="flex items-center gap-0.5">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white [animation-delay:-0.3s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white [animation-delay:-0.15s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white" />
    </span>
  );
}
export default function HorizontalScroller({
  children,
  onNext,
  onPrev,
  isFetching = false,
  showArrowsRight = false,
  showArrowsLeft = false,
  scrollAmount,
}: HorizontalScrollerProps) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (direction: number) => {
    const amount = scrollAmount ?? ref.current?.clientWidth ?? 360;
    ref.current?.scrollBy({
      left: direction * amount,
      behavior: 'smooth',
    });
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onPrev) {
      onPrev();
      return;
    }
    scroll(-1);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onNext) {
      onNext();
      return;
    }
    scroll(1);
  };

  return (
    <div className="relative w-full">
      {showArrowsLeft && (
        <Button
          type="button"
          onClick={handlePrev}
          className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-zinc-900/90 p-2"
          icon={<ChevronLeft size={18} />}
        />
      )}
      {showArrowsRight && (
        <Button
          type="button"
          onClick={handleNext}
          className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-zinc-900/90 p-2"
          icon={<ChevronRight size={18} />}
        />
      )}

      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-[#18181b] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-[#18181b] to-transparent" />

      {isFetching && (
        <div className="absolute inset-0 z-30 flex items-center justify-center backdrop-blur-[1px]">
          <LoadingDots />
        </div>
      )}

      <div
        ref={ref}
        className={`scrollbar-hide flex w-full gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory px-12 pb-2 transition-opacity ${
          isFetching ? 'opacity-60' : 'opacity-100'
        }`}
      >
        {children}
      </div>
    </div>
  );
}
