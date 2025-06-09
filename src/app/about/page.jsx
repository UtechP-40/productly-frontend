'use client';

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { ScrollArea } from "../../components/ui/scroll-area";
import Navigation from '../../components/Navigation';
import { motion } from 'framer-motion';

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const AboutUs = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Top SVG Wave */}
      <svg className="absolute top-0 left-0 w-full h-64 text-indigo-200 -z-10" preserveAspectRatio="none" viewBox="0 0 1440 320">
        <path fill="currentColor" fillOpacity="1" d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,90.7C672,85,768,107,864,106.7C960,107,1056,85,1152,96C1248,107,1344,149,1392,170.7L1440,192L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
      </svg>

      <Navigation isAuthenticated={true} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-20 relative z-10">
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
        >
          <Card className="shadow-xl border-none bg-white/80 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-4xl font-extrabold text-center text-primary">About Productly</CardTitle>
              <p className="text-muted-foreground text-center mt-2 text-sm">Empowering field teams with modern tools and AI support.</p>
            </CardHeader>

            <Separator />

            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-6 text-gray-800 text-lg leading-relaxed">
                  <p>
                    <span className="font-semibold">Productly</span> is a powerful SaaS platform designed for field service management companies—
                    especially those handling ATM maintenance, security, cleaning, and repair services.
                  </p>

                  <p>
                    Every organization gets a custom subdomain like <code className="bg-muted px-2 py-1 rounded text-sm">yourorg.productly.com</code> and a role-based workspace to manage teams, tasks, and workflows efficiently.
                  </p>

                  <p>
                    From real-time task assignments to media uploads and AI-backed multilingual support, Productly brings all the tools your team needs in one modern dashboard.
                  </p>

                  <p>
                    Admins have powerful controls—view reports, assign permissions, approve employees, and track field progress with detailed analytics.
                  </p>

                  <p>
                    Our system is scalable, secure, and customizable to fit your company’s growing needs.
                  </p>

                  <p className="font-medium text-primary">
                    Whether you&apos;re managing 10 or 10,000 agents, Productly empowers your workforce to work smarter, faster, and better.
                  </p>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* Bottom SVG Wave */}
      <svg className="absolute bottom-0 left-0 w-full h-64 text-indigo-200 -z-10" preserveAspectRatio="none" viewBox="0 0 1440 320">
        <path fill="currentColor" fillOpacity="1" d="M0,256L48,234.7C96,213,192,171,288,160C384,149,480,171,576,176C672,181,768,171,864,144C960,117,1056,75,1152,85.3C1248,96,1344,160,1392,192L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
      </svg>
    </div>
  );
};

export default AboutUs;