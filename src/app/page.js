'use client';

import Image from "next/image";
import Link from "next/link";
import Navigation from "../components/Navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-white to-slate-50 min-h-screen">
      <Navigation isAuthenticated={true} />

      {/* Hero Section */}
      <section className="text-center py-20 px-4 sm:px-8">
        <motion.div 
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-extrabold tracking-tight mb-6 text-gray-900">
            Transform How You Manage Field Operations with <span className="text-primary">Productly</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            A powerful, customizable platform for management companies handling ATM maintenance, housekeeping, surveillance, and repair services.
            Empower your field teams with real-time tools, role-based dashboards, and voice-enabled AI assistance.
          </p>
          <Link href="/register">
            <Button size="lg" className="px-8 text-base">
              Get Started
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "Custom Subdomains",
            desc: "Your own space like yourorg.productly.com with full branding & access control.",
          },
          {
            title: "Field Team Tracking",
            desc: "Assign tasks, track progress, and view submissions with media uploads in real-time.",
          },
          {
            title: "AI-Powered Assistance",
            desc: "Multilingual voice-based assistant to guide field agents and reduce response times.",
          },
          {
            title: "Admin Dashboard",
            desc: "Approve users, manage roles, and access analytics all from one place.",
          },
          {
            title: "Secure & Scalable",
            desc: "Robust role-based permissions, encrypted data, and enterprise-level scalability.",
          },
          {
            title: "Insightful Reports",
            desc: "Track KPIs, completion rates, and employee performance visually.",
          },
        ].map((item, idx) => (
          <motion.div 
            key={idx} 
            className="w-full"
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="h-full hover:shadow-lg transition duration-300">
              <CardHeader>
                <CardTitle className="text-xl">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{item.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* Footer CTA */}
      <section className="text-center py-16 bg-muted/40">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Digitize Your Field Operations?</h2>
          <p className="text-muted-foreground mb-6">Sign up today and start managing your team with Productly.</p>
          <Link href="/register">
            <Button size="lg" className="px-8 text-base">
              Get Started
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
