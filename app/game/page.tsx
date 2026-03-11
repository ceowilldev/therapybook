'use client';

import SpaceInvaders from './SpaceInvaders';

export default function GamePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black">
      <SpaceInvaders />
    </main>
  );
}
