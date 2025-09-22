"use client";

import { useEffect, useRef } from 'react';

interface OptimizedSplineProps {
  scene: string;
  className?: string;
}

export default function OptimizedSpline({ scene, className = "" }: OptimizedSplineProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    // Load the script
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@splinetool/viewer@1.10.64/build/spline-viewer.js';
    
    script.onload = () => {
      console.log('✅ Spline script loaded');
      
      // Add watermark removal styles
      const hideWatermarkStyles = `
        spline-viewer a[href*="spline"],
        spline-viewer div[style*="bottom"],
        a[href*="spline.design"],
        div[style*="position: absolute"][style*="bottom"] {
          display: none !important;
          opacity: 0 !important;
        }
        spline-viewer {
          --logo-display: none !important;
        }
      `;
      
      if (!document.getElementById('spline-hide-styles')) {
        const style = document.createElement('style');
        style.id = 'spline-hide-styles';
        style.textContent = hideWatermarkStyles;
        document.head.appendChild(style);
      }
      
      // Create the viewer element after script loads
      setTimeout(() => {
        if (containerRef.current) {
          const viewer = document.createElement('spline-viewer') as any;
          viewer.setAttribute('url', scene);
          viewer.style.width = '100%';
          viewer.style.height = '100vh';
          viewer.style.display = 'block';
          
          // Clear container and add viewer
          containerRef.current.innerHTML = '';
          containerRef.current.appendChild(viewer);
          
          console.log('✅ Spline viewer added');
          
          // Additional watermark cleanup after model loads
          setTimeout(() => {
            const watermarkElements = document.querySelectorAll('a[href*="spline.design"], spline-viewer a[href*="spline"]');
            watermarkElements.forEach(el => {
              (el as HTMLElement).style.display = 'none';
            });
          }, 3000);
        }
      }, 100);
    };
    
    script.onerror = () => {
      console.error('❌ Failed to load Spline script');
      if (containerRef.current) {
        containerRef.current.innerHTML = `
          <div style="width: 100%; height: 100vh; background: linear-gradient(135deg, #1e293b, #334155); display: flex; align-items: center; justify-content: center; color: white;">
            <div style="text-align: center;">
              <div style="font-size: 18px; margin-bottom: 8px;">3D Model Unavailable</div>
              <div style="font-size: 14px; opacity: 0.7;">Please refresh to try again</div>
            </div>
          </div>
        `;
      }
    };

    // Check if script already exists
    if (!document.querySelector('script[src*="spline-viewer"]')) {
      document.head.appendChild(script);
    } else {
      script.onload!(new Event('load'));
    }

    return () => {
      // Cleanup
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [scene]);

  return (
    <div 
      ref={containerRef} 
      className={className}
      style={{
        width: '100%',
        height: '100vh',
        background: 'linear-gradient(135deg, #1e293b, #334155)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        position: 'relative'
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '18px', marginBottom: '8px' }}>Loading 3D Model...</div>
        <div style={{ fontSize: '14px', opacity: 0.7 }}>Please wait</div>
      </div>
      
      {/* Watermark Cover Overlay - Right Side */}
      <div 
        style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          zIndex: 9999,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(10px)',
          padding: '8px 16px',
          borderRadius: '8px',
          color: 'white',
          fontSize: '14px',
          fontWeight: '500',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          pointerEvents: 'none'
        }}
      >
        Connect. Compute. Complete.
      </div>
    </div>
  );
}
