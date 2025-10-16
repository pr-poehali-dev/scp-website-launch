const BloodDrops = () => {
  return (
    <>
      <div 
        className="absolute top-0 left-1/2 w-0.5 h-0 animate-drip3"
        style={{
          background: 'linear-gradient(to bottom, #8B0000, transparent)',
          animationDelay: '2s'
        }}
      />
      <div 
        className="absolute top-0 left-[40%] w-0.5 h-0 animate-drip4"
        style={{
          background: 'linear-gradient(to bottom, #8B0000, transparent)',
          animationDelay: '3.5s'
        }}
      />
      <div 
        className="absolute top-0 left-[60%] w-0.5 h-0 animate-drip5"
        style={{
          background: 'linear-gradient(to bottom, #8B0000, transparent)',
          animationDelay: '1.5s'
        }}
      />
    </>
  );
};

export default BloodDrops;
