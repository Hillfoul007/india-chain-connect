import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const reasons = [
  "Cross-domain—not a narrow app",
  "Uses India DPI philosophy",
  "Web3 as infrastructure, not hype",
  "Scales nationally from day one",
  "Strong social + commercial impact",
  "Deployable, not theoretical",
];

const WhySection = () => {
  return (
    <section className="py-24">
      <div className="container px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl sm:text-5xl font-bold mb-6">
              Why <span className="text-gradient-saffron">IndiaChain</span> Wins
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              India's challenges aren't from lack of solutions but from fragmentation.
              IndiaChain unifies mobility, trade, and finance into one privacy-first backbone.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {reasons.map((reason, i) => (
              <motion.div
                key={reason}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3 glass rounded-xl px-5 py-4"
              >
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-foreground font-medium">{reason}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhySection;
