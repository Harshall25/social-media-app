export function FloatingOrbs() {
  return (
    <>
      <div className="absolute top-10 right-10 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl float"></div>
      <div 
        className="absolute bottom-10 left-10 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl" 
        style={{animationDelay: '2s'}}
      ></div>
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-400/5 rounded-full blur-3xl"
        style={{animationDelay: '4s'}}
      ></div>
    </>
  );
}