import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      <div className="container relative z-10 px-6 py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
            <span className="text-sm font-medium text-muted-foreground">
              Privacy-First Digital Infrastructure for India
            </span>
          </motion.div>

          {/* Headline */}
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            <span className="text-foreground">Move. Trade.</span>
            <br />
            <span className="text-gradient-saffron">Get Paid.</span>
            <br />
            <span className="text-foreground">Securely.</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            IndiaChain stitches together mobility, trade, and financial inclusion
            using Web3 primitives and India's Digital Public Infrastructure—without
            sacrificing privacy.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6 font-display font-semibold gap-2 group" onClick={() => navigate("/auth")}>
              Get Started
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 font-display font-semibold border-border/60 text-foreground hover:bg-secondary"
            >
              Read Whitepaper
            </Button>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="grid grid-cols-3 gap-6 max-w-xl mx-auto mt-16"
          >
            {[
              { label: "Tracks Covered", value: "7+" },
              { label: "Near-Zero Fees", value: "<₹0.01" },
              { label: "KYC Once", value: "∞ Uses" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-display font-bold text-gradient-saffron">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Floating decorative icons */}
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-1/4 left-[10%] hidden lg:block"
      >
        <div className="glass rounded-2xl p-4 bg-glow-saffron">
          <Shield className="w-8 h-8 text-primary" />
        </div>
      </motion.div>
      <motion.div
        animate={{ y: [10, -10, 10] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute bottom-1/3 right-[10%] hidden lg:block"
      >
        <div className="glass rounded-2xl p-4 bg-glow-indigo">
          <Zap className="w-8 h-8 text-accent" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
