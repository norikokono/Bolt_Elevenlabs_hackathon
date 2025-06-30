import React, { useState, useEffect } from 'react';
import { Trophy, Zap, Star, Target, Code2, Users, Globe, Sparkles } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [logoAnimation, setLogoAnimation] = useState('float-gentle');
  const [showCrackEffect, setShowCrackEffect] = useState(false);
  const [shootingStars, setShootingStars] = useState<Array<{ 
    id: number; 
    delay: number; 
    duration: number; 
    startX: number; 
    startY: number; 
    endX: number; 
    endY: number;
    color: string;
    sparkles: Array<{
      id: number;
      delay: number;
      x: number;
      y: number;
      color: string;
      size: number;
    }>;
  }>>([]);

  useEffect(() => {
    setIsVisible(true);
    
    // Start crack effect after a brief delay
    const crackTimer = setTimeout(() => {
      setShowCrackEffect(true);
    }, 800);
    
    // Cycle through different animations for the logo
    const animations = ['float-gentle', 'wiggle', 'dance', 'glow-pulse', 'rainbow'];
    let currentIndex = 0;
    
    const animationInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % animations.length;
      setLogoAnimation(animations[currentIndex]);
    }, 4000);

    // Enhanced vibrant translucent shooting stars animation with INCREASED frequency and faster speed
    const createShootingStar = () => {
      const id = Date.now() + Math.random();
      const delay = Math.random() * 800; // Reduced delay for more frequent stars
      const duration = 1200 + Math.random() * 600; // Faster: 1.2-1.8 seconds
      
      // Random starting position (top and left edges)
      const startFromTop = Math.random() > 0.5;
      const startX = startFromTop ? Math.random() * 100 : -10;
      const startY = startFromTop ? -10 : Math.random() * 50;
      
      // End position (bottom right area)
      const endX = startX + 35 + Math.random() * 40;
      const endY = startY + 35 + Math.random() * 40;
      
      // Vibrant translucent star colors with alpha values for translucency
      const starColors = [
        'rgba(96, 165, 250, 0.8)',   // Blue with 80% opacity
        'rgba(168, 85, 247, 0.8)',   // Purple with 80% opacity
        'rgba(52, 211, 153, 0.8)',   // Green with 80% opacity
        'rgba(244, 114, 182, 0.8)',  // Pink with 80% opacity
        'rgba(251, 191, 36, 0.8)',   // Yellow with 80% opacity
        'rgba(251, 113, 133, 0.8)',  // Rose with 80% opacity
        'rgba(56, 189, 248, 0.8)',   // Sky blue with 80% opacity
        'rgba(167, 139, 250, 0.8)',  // Violet with 80% opacity
        'rgba(34, 197, 94, 0.8)',    // Emerald with 80% opacity
        'rgba(249, 115, 22, 0.8)',   // Orange with 80% opacity
        'rgba(236, 72, 153, 0.8)',   // Fuchsia with 80% opacity
        'rgba(14, 165, 233, 0.8)',   // Light blue with 80% opacity
      ];
      const starColor = starColors[Math.floor(Math.random() * starColors.length)];
      
      // Create vibrant translucent sparkles along the trail
      const sparkles = [];
      const sparkleCount = 10 + Math.floor(Math.random() * 8); // More sparkles: 10-18
      const sparkleColors = [
        'rgba(255, 255, 255, 0.9)',   // White with transparency
        'rgba(224, 231, 255, 0.8)',   // Light blue
        'rgba(221, 214, 254, 0.8)',   // Light purple
        'rgba(252, 231, 243, 0.8)',   // Light pink
        'rgba(236, 253, 245, 0.8)',   // Light green
        'rgba(254, 243, 199, 0.8)',   // Light yellow
        'rgba(254, 242, 242, 0.8)',   // Light red
        'rgba(240, 249, 255, 0.8)',   // Light cyan
        'rgba(167, 243, 208, 0.8)',   // Light emerald
        'rgba(253, 224, 71, 0.8)',    // Light amber
        'rgba(196, 181, 253, 0.8)',   // Light violet
        'rgba(147, 197, 253, 0.8)',   // Light sky
      ];
      
      for (let i = 0; i < sparkleCount; i++) {
        const progress = i / sparkleCount;
        const sparkleDelay = delay + (duration * progress * 0.6);
        const sparkleX = startX + (endX - startX) * progress + (Math.random() - 0.5) * 15;
        const sparkleY = startY + (endY - startY) * progress + (Math.random() - 0.5) * 15;
        
        sparkles.push({
          id: Math.random(),
          delay: sparkleDelay,
          x: sparkleX,
          y: sparkleY,
          color: sparkleColors[Math.floor(Math.random() * sparkleColors.length)],
          size: 0.6 + Math.random() * 1.2
        });
      }
      
      const newStar = {
        id,
        delay,
        duration,
        startX,
        startY,
        endX,
        endY,
        color: starColor,
        sparkles
      };
      
      setShootingStars(prev => [...prev, newStar]);
      
      // Remove the star after animation completes
      setTimeout(() => {
        setShootingStars(prev => prev.filter(star => star.id !== id));
      }, delay + duration + 1000);
    };

    // Create shooting stars with MUCH MORE frequency - more magical and engaging!
    const shootingStarInterval = setInterval(() => {
      // Much more frequent: higher chance to create stars
      if (Math.random() > 0.15) { // 85% chance to create a star (was 30%)
        createShootingStar();
      }
      
      // Sometimes create multiple stars for extra magic
      if (Math.random() > 0.7) { // 30% chance for a second star
        setTimeout(() => createShootingStar(), Math.random() * 1000);
      }
    }, 3000 + Math.random() * 4000); // Every 3-7 seconds (was 12-30 seconds!)

    // Create initial shooting stars with shorter delay
    setTimeout(() => createShootingStar(), 2000); // Wait 2 seconds before first star
    setTimeout(() => createShootingStar(), 4000); // Second star after 4 seconds

    return () => {
      clearTimeout(crackTimer);
      clearInterval(animationInterval);
      clearInterval(shootingStarInterval);
    };
  }, []);

  const handleLogoClick = () => {
    // Trigger a fun animation on click
    setLogoAnimation('dance');
    setTimeout(() => setLogoAnimation('float-gentle'), 2000);
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20 border-b border-gray-700">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Enhanced Vibrant Translucent Shooting Stars with Soft Edges - MUCH More Frequent and Faster */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {shootingStars.map((star) => (
          <div key={star.id}>
            {/* Main vibrant translucent shooting star */}
            <div
              className="absolute shooting-star"
              style={{
                left: `${star.startX}%`,
                top: `${star.startY}%`,
                '--delay': `${star.delay}ms`,
                '--duration': `${star.duration}ms`,
                '--end-x': `${star.endX - star.startX}vw`,
                '--end-y': `${star.endY - star.startY}vh`,
              } as React.CSSProperties}
            >
              {/* Main star core with vibrant translucent color and soft edges */}
              <div className="relative">
                <div 
                  className="w-3 h-3 rounded-full shadow-2xl vibrant-sparkle-glow"
                  style={{
                    backgroundColor: star.color,
                    filter: 'blur(1px)', // Soft edges
                    '--duration': `${star.duration}ms`,
                    '--sparkle-delay': `${star.delay}ms`,
                  } as React.CSSProperties}>
                </div>
                
                {/* Vibrant translucent star trail with enhanced blur for soft edges */}
                <div 
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-1 rounded-full shooting-star-trail"
                  style={{
                    background: `linear-gradient(to right, transparent, ${star.color}, transparent)`,
                    filter: 'blur(2px)', // Enhanced blur for softer edges
                    '--delay': `${star.delay}ms`,
                    '--duration': `${star.duration}ms`,
                  } as React.CSSProperties}>
                </div>
                
                {/* Enhanced outer glow with vibrant color and soft edges */}
                <div 
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full vibrant-sparkle-glow"
                  style={{
                    backgroundColor: star.color.replace('0.8)', '0.4)'), // More translucent
                    filter: 'blur(4px)', // Much softer edges
                    '--duration': `${star.duration}ms`,
                    '--sparkle-delay': `${star.delay + 150}ms`,
                  } as React.CSSProperties}>
                </div>
                
                {/* Additional soft glow layer for extra vibrancy */}
                <div 
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full vibrant-sparkle-glow"
                  style={{
                    backgroundColor: star.color.replace('0.8)', '0.2)'), // Very translucent
                    filter: 'blur(8px)', // Very soft edges
                    '--duration': `${star.duration}ms`,
                    '--sparkle-delay': `${star.delay + 300}ms`,
                  } as React.CSSProperties}>
                </div>
              </div>
            </div>
            
            {/* Vibrant translucent sparkle trail with soft edges */}
            {star.sparkles.map((sparkle) => (
              <div
                key={sparkle.id}
                className="absolute translucent-fade-sparkle"
                style={{
                  left: `${sparkle.x}%`,
                  top: `${sparkle.y}%`,
                  '--duration': `${star.duration * 0.7}ms`,
                  '--sparkle-delay': `${sparkle.delay}ms`,
                } as React.CSSProperties}
              >
                <div 
                  className="rounded-full vibrant-sparkle-trail"
                  style={{
                    width: `${sparkle.size}rem`,
                    height: `${sparkle.size}rem`,
                    backgroundColor: sparkle.color,
                    boxShadow: `0 0 ${sparkle.size * 8}px ${sparkle.color}`,
                    filter: 'blur(1px)', // Soft edges for sparkles
                    '--duration': `${star.duration * 0.5}ms`,
                    '--sparkle-delay': `${sparkle.delay}ms`,
                  } as React.CSSProperties}
                >
                </div>
                
                {/* Additional soft glow for sparkles */}
                <div 
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    width: `${sparkle.size * 1.5}rem`,
                    height: `${sparkle.size * 1.5}rem`,
                    backgroundColor: sparkle.color.replace(/[\d\.]+\)/, '0.3)'), // More translucent
                    filter: 'blur(3px)', // Very soft edges
                    animation: `translucentFadeSparkle ${star.duration * 0.6}ms ease-out forwards`,
                    animationDelay: `${sparkle.delay}ms`,
                  } as React.CSSProperties}
                >
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Enhanced Bolt Logo - Left Bottom Corner with Multiple Animations */}
      <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-20">
        <a
          href="https://bolt.new"
          target="_blank"
          rel="noopener noreferrer"
          className="block group relative"
          onClick={handleLogoClick}
        >
          {/* Multi-layered Animated Background Glow */}
          <div className="absolute -inset-3 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-pink-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-500 blur-lg animate-pulse"></div>
          <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400/10 via-purple-400/10 to-pink-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-700 blur-md animate-pulse" style={{ animationDelay: '0.3s' }}></div>
          
          {/* Sparkle Trail Effects */}
          <div className="absolute -top-2 -right-2 w-2 h-2 bg-yellow-300 rounded-full opacity-0 group-hover:opacity-100 sparkle-trail"></div>
          <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-blue-300 rounded-full opacity-0 group-hover:opacity-100 sparkle-trail" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-1/2 -right-3 w-1 h-1 bg-pink-300 rounded-full opacity-0 group-hover:opacity-100 sparkle-trail" style={{ animationDelay: '1s' }}></div>
          
          {/* Main Animated Logo */}
          <img
            src="/images/logotext_poweredby_360w.png"
            alt="Built with Bolt.new"
            className={`
              w-24 sm:w-32 md:w-40 h-auto opacity-90 hover:opacity-100 
              transition-all duration-300 relative z-10 cursor-pointer
              logo-interactive
              animate-${logoAnimation}
            `}
            style={{
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
              transformOrigin: 'center center'
            }}
          />
          
          {/* Rotating Border Ring */}
          <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-purple-400/30 via-blue-400/30 to-pink-400/30 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-500 animate-spin-slow" style={{ 
            backgroundClip: 'padding-box',
            border: '2px solid transparent',
            background: 'linear-gradient(45deg, rgba(147, 51, 234, 0.3), rgba(59, 130, 246, 0.3), rgba(236, 72, 153, 0.3)) border-box'
          }}></div>
          
          {/* Pulsing Outer Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300 blur-sm"></div>
          
          {/* Interactive Hover Text */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap backdrop-blur-sm border border-gray-700">
            ✨ Built with Bolt.new
          </div>
        </a>
      </div>

      {/* Vibe Coded by Me - Right Bottom Corner */}
      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-20">
        <div className="group relative">
          {/* Animated Background Glow */}
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-500 blur-lg animate-pulse"></div>
          
          {/* Main Text Container */}
          <div className="relative bg-gradient-to-br from-gray-900/80 via-blue-900/40 to-purple-900/40 backdrop-blur-sm border border-blue-500/30 rounded-xl px-4 py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20">
            {/* Sparkle Effects */}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-300 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300"></div>
            <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-purple-300 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300" style={{ animationDelay: '0.3s' }}></div>
            
            {/* Text Content */}
            <div className="text-right">
              <div className="text-sm sm:text-base font-medium bg-gradient-to-r from-blue-200 via-white to-blue-200 bg-clip-text text-transparent leading-tight">
                Vibe ♡ coded 
                <br />
                <span className="text-xs sm:text-sm font-light bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                by Noriko Kono
                </span>
              </div>
            </div>
            
            {/* Subtle Inner Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          
          {/* Floating Code Icon */}
          <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110">
            <Code2 className="w-3 h-3 text-white" />
          </div>
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className={`text-center mb-8 sm:mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Hackathon Title with Animation - FIXED SPACING */}
          <div className="relative inline-block mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold relative z-10">
              <span className="bg-gradient-to-r from-slate-300 via-blue-200 to-slate-300 bg-clip-text text-transparent">
                World's Largest Hackathon presented by{' '}
              </span>
              <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent font-bold">
                Bolt
              </span>
              <span className="bg-gradient-to-r from-slate-300 via-blue-200 to-slate-300 bg-clip-text text-transparent">
                {' '}2025
              </span>
            </h2>
            <div className="absolute -inset-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg blur-sm animate-pulse"></div>
          </div>

          {/* Main Title with Cracked Text Effect - Two Lines with Proper Spacing */}
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
            <div className="flex flex-col items-center space-y-2">
              <span 
                className={`
                  block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent 
                  transition-all duration-1000 cracked-text
                  ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}
                  ${showCrackEffect ? 'animate-text-shatter' : ''}
                `}
                style={{ animationDelay: '0.2s' }}
              >
                Voice AI
              </span>
              <span 
                className={`
                  block bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent 
                  transition-all duration-1000 cracked-text
                  ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}
                  ${showCrackEffect ? 'animate-text-shatter' : ''}
                `}
                style={{ animationDelay: '0.6s' }}
              >
                Assistant
              </span>
            </div>
          </h1>

          {/* Smaller Subtitle with Blue Gradient Hint */}
          <div 
            className={`
              text-base sm:text-lg md:text-xl lg:text-2xl 
              mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed px-4
              transition-all duration-1000 ease-out
              ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}
            `}
            style={{ animationDelay: '1.2s' }}
          >
            <p className="font-light tracking-wide">
              <span className="text-white/90 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">Advanced speech recognition</span>
              <span className="text-white/70"> with </span>
              <span className="text-white/90 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">intelligent AI responses</span>
              <span className="text-white/70"> and </span>
              <span className="text-white/90 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">premium voice synthesis</span>
              <span className="text-white/70"> - </span>
              <span className="font-semibold bg-gradient-to-r from-blue-200 via-white to-blue-200 bg-clip-text text-transparent text-lg sm:text-xl md:text-2xl">let's talk AI!</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};