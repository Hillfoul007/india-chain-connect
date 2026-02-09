import { motion } from "framer-motion";
import { Car, Store, Truck, Building, Users } from "lucide-react";

const beneficiaries = [
  {
    icon: Car,
    title: "Auto & EV Drivers",
    benefit: "Faster loans, insurance, and less KYC pain",
  },
  {
    icon: Store,
    title: "MSMEs & Kirana Stores",
    benefit: "Cheaper logistics and working capital access",
  },
  {
    icon: Truck,
    title: "Logistics Startups",
    benefit: "Unified data layer and lower operational costs",
  },
  {
    icon: Building,
    title: "Government",
    benefit: "Privacy-first compliance and transparency",
  },
  {
    icon: Users,
    title: "Citizens",
    benefit: "Better mobility, lower costs, trust by design",
  },
];

const BeneficiariesSection = () => {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      <div className="container px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            Real <span className="text-gradient-indigo">India</span> Impact
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            From auto drivers to governments—IndiaChain benefits millions across the stack.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {beneficiaries.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-2xl p-6 text-center hover:border-accent/30 transition-colors"
            >
              <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                <b.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">{b.title}</h3>
              <p className="text-sm text-muted-foreground">{b.benefit}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BeneficiariesSection;
