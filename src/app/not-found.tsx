import { Compass, MoveLeft } from "lucide-react";

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
        <p
          className="text-lg md:text-xl lg:text-2xl leading-relaxed max-w-2xl mx-auto"
          style={{ color: "var(--ring)" }}
        >
          The page you're looking for doesn't exist, has been moved, or is
          temporarily unavailable.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-row items-center justify-center gap-2">
          <a
            href="/"
            className="group flex items-center gap-1 px-3 py-2 sm:px-7 sm:py-3 rounded-xl font-semibold text-sm sm:text-lg bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-black shadow-lg hover:shadow-xl hover:text-white hover:brightness-110 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400 whitespace-nowrap flex-shrink-0"
          >
            <MoveLeft
              size={18}
              className="sm:mr-2 text-black group-hover:text-white transition-colors"
            />
            <span className="hidden xs:inline sm:inline">Back to Home</span>
            <span className="md:hidden">Home</span>
          </a>

          <a
            href="/portfolio"
            className="group flex items-center gap-1 px-3 py-2 sm:px-7 sm:py-3 rounded-xl font-semibold text-sm sm:text-lg border-2 border-cyan-400 text-cyan-300 bg-transparent hover:bg-cyan-950/10 hover:border-cyan-300 hover:shadow-xl hover:brightness-110 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400 whitespace-nowrap flex-shrink-0"
          >
            <Compass
              size={18}
              className="sm:mr-2 text-cyan-400 group-hover:text-cyan-300 transition-colors"
            />
            <span className="hidden xs:inline sm:inline">Explore our work</span>
            <span className="md:hidden">Explore</span>
          </a>
        </div>
      </div>

      {/* Subtle animated elements for visual interest */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-pulse"></div>
      <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-purple-400/40 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-cyan-400/25 rounded-full animate-pulse delay-500"></div>
    </div>
  );
}
