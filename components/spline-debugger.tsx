"use client";

import { useEffect } from 'react';

export default function SplineDebugger() {
  useEffect(() => {
    console.log('🔍 SplineDebugger: Component mounted');
    
    // Load script directly
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@splinetool/viewer@1.10.64/build/spline-viewer.js';
    
    script.onload = () => {
      console.log('✅ Script loaded successfully');
      
      // Create spline-viewer element
      const viewer = document.createElement('spline-viewer');
      viewer.setAttribute('url', 'https://prod.spline.design/KNeoX42LGSI6oW-F/scene.splinecode');
      viewer.style.width = '100%';
      viewer.style.height = '300px';
      viewer.style.display = 'block';
      viewer.style.border = '2px solid red'; // Debug border
      
      const container = document.getElementById('spline-test');
      if (container) {
        container.appendChild(viewer);
        console.log('✅ Spline viewer added to DOM');
      }
    };
    
    script.onerror = () => {
      console.error('❌ Failed to load Spline script');
    };
    
    document.head.appendChild(script);
  }, []);

  return (
    <div style={{ padding: '20px', backgroundColor: '#1e293b' }}>
      <h2 style={{ color: 'white', marginBottom: '20px' }}>Spline Debug Test</h2>
      <div 
        id="spline-test" 
        style={{ 
          width: '100%', 
          height: '300px', 
          backgroundColor: '#334155',
          border: '2px dashed white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white'
        }}
      >
        Loading Spline Model...
      </div>
    </div>
  );
}
