"use client";

import { Application } from "@splinetool/runtime";
import React, { Suspense, useEffect, useState } from "react";

const Spline = React.lazy(() => import("@splinetool/react-spline"));

export default function LaptopComponent() {
  const [sceneUrl, setSceneUrl] = useState("/3D/laptop.spline");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const handleSceneChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setSceneUrl(event.matches ? "/3D/laptop_responsive.spline" : "/3D/laptop.spline");
    };

    handleSceneChange(mediaQuery);
    mediaQuery.addEventListener("change", handleSceneChange);

    const visibilityTimer = window.setTimeout(() => setIsVisible(true), 150);

    return () => {
      mediaQuery.removeEventListener("change", handleSceneChange);
      window.clearTimeout(visibilityTimer);
    };
  }, []);

  return (
    <Suspense fallback={<div className="text-center text-gray-500">Dang tai mo hinh 3D...</div>}>
      <div
        className="relative mx-auto w-full max-w-[800px] overflow-hidden sm:mr-20"
        style={{
          height: "50vh",
          minHeight: "300px",
        }}
      >
        {isVisible ? <Spline onLoad={(_: Application) => undefined} scene={sceneUrl} /> : null}
      </div>
    </Suspense>
  );
}
