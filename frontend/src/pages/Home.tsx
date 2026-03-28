import { useEffect, useRef } from "react";

import { Outlet } from "react-router-dom";
import gsap from "gsap";
import useUi from "../hooks/useUi";
import SlideBar from "./subPages/SlideBar";
import NavBar from "../components/NavBar";

const SIDEBAR_WIDTH = 256;

const Home = () => {
  const { menuIsOpen } = useUi();
  const sidebarRef = useRef(null);
  const mainRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: "power2.out" },
      );
    }
  }, []);

  useEffect(() => {
    if (!sidebarRef.current || !mainRef.current) return;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    if (menuIsOpen) {
      gsap.to(sidebarRef.current, {
        x: 0,
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      });
      if (!isMobile)
        gsap.to(mainRef.current, {
          marginLeft: SIDEBAR_WIDTH,
          duration: 0.4,
          ease: "power2.out",
        });
    } else {
      gsap.to(sidebarRef.current, {
        x: isMobile ? "-100%" : -SIDEBAR_WIDTH,
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
      });
      gsap.to(mainRef.current, {
        marginLeft: 0,
        duration: 0.4,
        ease: "power2.in",
      });
    }
  }, [menuIsOpen]);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#0A0F1C] flex flex-col overflow-hidden scrollbar-hide"
    >
      <div className="mt-10">
        <NavBar />
      </div>
      <div className="flex flex-1 relative">
        <aside
          ref={sidebarRef}
          className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-full md:w-64 bg-[#0A0F1C] text-white z-20 -translate-x-full md:translate-x-0 mr-9"
        >
          <SlideBar />
        </aside>
        <main
          ref={mainRef}
          className="flex-1 overflow-y-auto bg-[#050723] text-white transition-all duration-300 px-5"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Home;
