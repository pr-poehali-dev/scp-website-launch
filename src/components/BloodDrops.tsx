const BloodDrops = () => {
  const drops = Array.from({ length: 12 }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 8,
    duration: 6 + Math.random() * 4
  }));

  return (
    <>
      {drops.map((drop, index) => (
        <div
          key={index}
          className="blood-drop"
          style={{
            left: `${drop.left}%`,
            animationDelay: `${drop.delay}s`,
            animationDuration: `${drop.duration}s`,
            '--start-x': `${drop.left}%`
          } as React.CSSProperties & { '--start-x': string }}
        />
      ))}
      <div className="logo-fill absolute inset-0 bg-gradient-to-b from-red-900/70 to-red-600/70 opacity-0 mix-blend-multiply" />
      <div className="logo-overflow absolute inset-x-0 top-full h-24 opacity-0">
        <div className="w-full h-full bg-gradient-to-b from-red-600 via-red-800 to-transparent" />
      </div>
    </>
  );
};

export default BloodDrops;