'use client';

export default function BackgroundFx() {
  return (
    <div className="bg-fx" aria-hidden="true">
      <div className="bg-fx-glow" />
      <div className="bg-fx-noise" />
      <span className="bg-shape bg-shape-a" />
      <span className="bg-shape bg-shape-b" />
      <span className="bg-shape bg-shape-c" />
      <span className="bg-shape bg-shape-d" />
      <span className="bg-streak bg-streak-a" />
      <span className="bg-streak bg-streak-b" />
      <span className="bg-streak bg-streak-c" />
    </div>
  );
}