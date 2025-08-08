export default function NotFound() {
  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Dynamic gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-slate-900 to-gray-900">
        {/* Additional gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-tl from-purple-950/35 via-transparent to-blue-950/30"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-slate-950/50 to-transparent"></div>
      </div>

      {/* Large semi-transparent 404 background number */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[40vw] md:text-[35vw] lg:text-[30vw] xl:text-[25vw] font-bold text-white/10 select-none pointer-events-none leading-none">
          404
        </span>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* ERROR 404 label */}
        <div className="mb-6">
          <span className="text-sm md:text-base font-medium text-gray-400 tracking-wider uppercase">
            ERROR 404
          </span>
        </div>

        {/* Main 404 Not Found heading */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-8">
          <span className="text-white">404 </span>
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            Not Found
          </span>
        </h1>

        {/* Descriptive subheading */}
        <p className="text-lg md:text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
          The page you're looking for doesn't exist, has been moved, or is
          temporarily unavailable.
        </p>
      </div>

      {/* Subtle animated elements for visual interest */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-pulse"></div>
      <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-purple-400/40 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-cyan-400/25 rounded-full animate-pulse delay-500"></div>
    </div>
  );
}
