'use client';

import Image from "next/image";
import Link from "next/link";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useKeenSlider } from 'keen-slider/react';
import { useEffect, useRef, useState } from 'react';
import 'keen-slider/keen-slider.min.css';

const images = [
  "https://www.esri.com/content/dam/esrisites/en-us/arcgis/capabilities/field-mobility-2/images/overview-banner.png",
  "https://www.totalmobile.co.uk/wp-content/uploads/2022/12/field-operations-hero.jpg",
  "https://framerusercontent.com/images/lq27ky5qBobiRV5zxfV8GetTzzU.jpg",
  "https://gcs.yourdatasmarter.com/wp-content/uploads/2019/06/Esri-ArcGIS-Field-Operations-Apps.jpg",
  "https://cdn.prod.website-files.com/6209ea9aee1f965d7fce7c19/6780ca2e1c1356b58e111874_6780ca1310898c74ed281c2a_no-code%2520features%2520with%2520ai.webp"

];

function Slideshow() {
  const [isHovered, setIsHovered] = useState(false);
  const autoplayTimer = useRef(null);

  const [sliderRef, slider] = useKeenSlider({
    loop: true,
    mode: "free-snap",
    slides: { perView: 1 },
    created() {
      startAutoplay();
    },
    dragStart() {
      clearTimeout(autoplayTimer.current);
    },
    dragEnd() {
      startAutoplay();
    },
  });

  function startAutoplay() {
    if (isHovered) return;
    clearTimeout(autoplayTimer.current);
    autoplayTimer.current = setTimeout(() => {
      slider.current?.next();
    }, 3000);
  }

  useEffect(() => {
    if (!sliderRef.current) return;

    const sliderEl = sliderRef.current;

    const onMouseEnter = () => {
      setIsHovered(true);
      clearTimeout(autoplayTimer.current);
    };

    const onMouseLeave = () => {
      setIsHovered(false);
      startAutoplay();
    };

    sliderEl.addEventListener("mouseenter", onMouseEnter);
    sliderEl.addEventListener("mouseleave", onMouseLeave);

    return () => {
      sliderEl.removeEventListener("mouseenter", onMouseEnter);
      sliderEl.removeEventListener("mouseleave", onMouseLeave);
      clearTimeout(autoplayTimer.current);
    };
  }, [sliderRef, isHovered]);

  return (
    <div
      ref={sliderRef}
      className="keen-slider my-16 max-w-6xl mx-auto rounded-xl overflow-hidden relative shadow-[0_4px_20px_rgba(173,216,230,0.4)]"
      style={{ height: "550px" }}
    >
      {images.map((src, i) => (
        <div className="keen-slider__slide" key={i}>
          <img
            src={src}
            alt={`Slide ${i + 1}`}
            className="object-cover w-full h-full"
            loading="lazy"
          />
        </div>
      ))}

      {/* Navigation Buttons */}
      <button
        onClick={() => slider.current?.prev()}
        className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-blue-100 bg-opacity-70 text-blue-700 shadow-lg p-4 hover:bg-blue-200 transition transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label="Previous Slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => slider.current?.next()}
        className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-blue-100 bg-opacity-70 text-blue-700 shadow-lg p-4 hover:bg-blue-200 transition transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label="Next Slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}



const features = [
  {
    title: "AI Voice Assistant",
    description: "Productly's AI assistant provides voice-based multilingual help to agents even in remote locations. It answers questions, navigates tasks, and works offline.",
    image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=1200",
  },
  {
    title: "Team Performance Dashboard",
    description: "Visual KPIs and smart reports give managers real-time clarity on field operations. See task completion, delays, media logs, and attendance in one place.",
    image: "https://plus.unsplash.com/premium_photo-1683140661365-f72ac5f58035?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Secure Role-Based Access",
    description: "Define roles such as Manager, Field Agent, QA, or Auditor. Control what they can view, do, or edit. Stay compliant with robust approval workflows.",
    image: "https://images.unsplash.com/photo-1556740772-1a741367b93e?w=1200",
  },
];



// const features = [
//   {
//     title: "Custom Subdomains",
//     desc: "Your own space like yourorg.productly.com with full branding & access control.",
//   },
//   {
//     title: "Real-Time Team Tracking",
//     desc: "Assign tasks, track submissions with media & geolocation in real-time.",
//   },
//   {
//     title: "Voice-based AI Assistant",
//     desc: "Multilingual guidance for agents in the field, even offline.",
//   },
//   {
//     title: "Robust Admin Control",
//     desc: "Role-based permissions, user approvals, and analytics dashboard.",
//   },
//   {
//     title: "Insightful Analytics",
//     desc: "Visualize KPIs, monitor team performance, and generate custom reports.",
//   },
//   {
//     title: "Secure & Scalable",
//     desc: "Built with enterprise-grade security and scalable architecture.",
//   },
// ];

export default function Home() {
  return (
    <div className="bg-white text-gray-900">
      <Navigation isAuthenticated={false} />

      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center text-center text-white">
        <Image
          src="https://images.unsplash.com/photo-1703969083653-da62f9ea70af?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Hero"
          fill
          className="object-cover absolute z-0"
          priority
        />
        <div className="relative z-10 bg-black/50 p-8 rounded-lg max-w-3xl">
          <motion.h1
            className="text-5xl font-extrabold leading-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Empower Field Operations with <span className="text-blue-200">Productly</span>
          </motion.h1>
          <p className="text-lg mb-6 text-white/80">
            Real-time dashboards, offline-first mobile tools, and AI-powered assistance for modern field teams.
          </p>
          <Link href="/register">
            <Button size="lg" className="px-10 text-base">Start Free Trial</Button>
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 px-6 bg-slate-50">
        <motion.h2
          className="text-4xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Everything Your Field Team Needs
        </motion.h2>
        <section className="py-24 bg-slate-100">
          <div className="max-w-6xl mx-auto px-6 space-y-20">
            {features.map((f, i) => (
              <motion.div
                key={i}
                className={`grid md:grid-cols-2 items-center gap-12 ${i % 2 !== 0 ? "md:flex-row-reverse" : ""}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                viewport={{ once: true }}
              >
                <Image
                  src={f.image}
                  alt={f.title}
                  width={600}
                  height={400}
                  className="rounded-lg shadow-xl object-cover w-full h-auto"
                />
                <div>
                  <h3 className="text-3xl font-bold mb-4">{f.title}</h3>
                  <p className="text-muted-foreground text-lg">{f.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

      </section>
      <Slideshow />
      {/* Testimonial Section */}
      <section className="py-20 bg-slate-100">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              className="bg-white rounded-lg shadow-lg p-8"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <p className="text-lg mb-4">"Productly has transformed our field operations. The AI assistant and real-time tracking are game-changers."</p>
              <p className="text-sm font-semibold">John Doe, Field Agent</p>
            </motion.div>
            <motion.div
              className="bg-white rounded-lg shadow-lg p-8"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <p className="text-lg mb-4">"Managing our team with Productly has been a game-changer. The intuitive interface and powerful features make it easy to track progress."</p>
              <p className="text-sm font-semibold">Jane Smith, Manager</p>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Call to Action Section */}
      {/* Image Showcase */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Image
              src="https://images.unsplash.com/photo-1663430186148-e7e69b15ad85?q=80&w=1744&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Field Team"
              width={800}
              height={600}
              className="rounded-xl shadow-xl w-full object-cover"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold mb-4">Built for Real-World Challenges</h3>
            <p className="text-muted-foreground mb-6">
              From rural field workers to on-site service technicians, Productly empowers teams to work smarter with offline access, photo uploads, and geo-tagged updates.
            </p>
            <Link href="/register">
              <Button size="lg">Try It Now</Button>
            </Link>
          </motion.div>
        </div>
      </section>
      <section className="py-20 bg-white text-center">
        <h2 className="text-4xl font-bold mb-6">See Productly in Action</h2>
        <p className="text-muted-foreground mb-8 text-lg">Watch how teams use Productly in the field.</p>
        <div className="max-w-4xl mx-auto rounded-lg overflow-hidden shadow-xl">
          <iframe
            src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
            title="Productly Demo"
            className="w-full h-[400px]"
            allowFullScreen
          />
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-20 bg-primary text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-extrabold mb-4">Start Optimizing Your Field Operations</h2>
          <p className="text-lg mb-8 text-white/80">Join thousands of teams using Productly to simplify and scale.</p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="px-8 text-base text-primary">Get Started</Button>
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
