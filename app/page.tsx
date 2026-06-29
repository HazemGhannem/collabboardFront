'use client';
import Landing from '@/components/landing/Landing';

export default function Home() {
  return (
    <div className="min-h-screen w-full flex justify-center items-center">
      <Landing
        onCreate={(name) => console.log('create board:', name)}
        onJoin={(value) => console.log('join board:', value)}
      />
    </div>
  );
}
