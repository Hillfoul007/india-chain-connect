import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent" />
      <div className="container px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-6">
            Ready to Build the{" "}
            <span className="text-gradient-saffron">Future</span>?
          </h2>
          <p className="text-muted-foreground text-lg mb-10">
            Explore our MVP—DID wallet, logistics dashboard, credit scoring, and
            decentralized storage—all running on high-throughput L2 infrastructure.
          </p>
          <Button size="lg" className="text-lg px-10 py-6 font-display font-semibold gap-2 group">
            Launch MVP Demo
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
