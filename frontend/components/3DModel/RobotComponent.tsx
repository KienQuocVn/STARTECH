'use client';

import { Application } from '@splinetool/runtime';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React, { Suspense, useEffect, useRef, useState } from 'react';

const Spline = React.lazy(() => import('@splinetool/react-spline'));
gsap.registerPlugin(ScrollTrigger);

function RobotFallback() {
  return (
    <div className="flex h-full min-h-[420px] w-full items-center justify-center rounded-[32px] bg-white/10 text-sm text-white/70 backdrop-blur-sm">
      Dang tai 3D showcase...
    </div>
  );
}

export default function RobotComponent() {
  const splineContainer = useRef<HTMLDivElement>(null);
  const [splineApp, setSplineApp] = useState<Application | null>(null);
  const [sceneUrl, setSceneUrl] = useState('/3D/startech.spline');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');

    const handleMediaChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setSceneUrl(event.matches ? '/3D/startech_reponsive.spline' : '/3D/startech.spline');
    };

    handleMediaChange(mediaQuery);
    mediaQuery.addEventListener('change', handleMediaChange);

    const timer = window.setTimeout(() => {
      setIsVisible(true);
    }, 180);

    return () => {
      window.clearTimeout(timer);
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  useEffect(() => {
    if (!splineApp || !splineContainer.current) return;

    splineApp.setVariable('visible', true);

    const robotObject = splineApp.findObjectByName('robot');
    if (!robotObject) return;

    const tween = gsap.fromTo(
      robotObject.position,
      { y: -200 },
      {
        y: 0,
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: splineContainer.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      },
    );

    return () => {
      tween.kill();
    };
  }, [splineApp]);

  return (
    <div ref={splineContainer} className="relative h-screen w-full">
      {isVisible ? (
        <Suspense fallback={<RobotFallback />}>
          <Spline onLoad={(app: Application) => setSplineApp(app)} scene={sceneUrl} />
        </Suspense>
      ) : (
        <RobotFallback />
      )}
    </div>
  );
}
