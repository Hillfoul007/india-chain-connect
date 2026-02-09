import { motion } from "framer-motion";
import { Fingerprint, MapPin, Wallet, HardDrive, Cpu } from "lucide-react";

const pillars = [
  {
    icon: Fingerprint,
    title: "ZK-KYC Identity",
    description:
      "Self-sovereign DID with Zero Knowledge Proofs. KYC once, verify everywhere—no Aadhaar or PAN stored on-chain.",
    tracks: ["DID & Privacy", "Compliance"],
    glow: "bg-glow-saffron",
    color: "text-primary",
  },
  {
    icon: MapPin,
    title: "Mobility Data Rails",
    description:
      "Real-time route optimization, EV charging integration, and congestion-aware dispatch for public transport & logistics.",
    tracks: ["Mobility", "Trade Flow"],
    glow: "bg-glow-indigo",
    color: "text-accent",
  },
  {
    icon: Wallet,
    title: "Embedded FinTech",
    description:
      "Instant micro-credit for auto drivers, delivery partners, and kirana stores—powered by activity data, not credit scores.",
    tracks: ["Financial Inclusion"],
    glow: "bg-glow-saffron",
    color: "text-primary",
  },
  {
    icon: HardDrive,
    title: "Decentralized Storage",
    description:
      "Tamper-proof delivery proofs, invoices, and compliance certificates on IPFS/Filecoin for trust and auditability.",
    tracks: ["Storage", "Persistence"],
    glow: "bg-glow-indigo",
    color: "text-accent",
  },
  {
    icon: Cpu,
    title: "High-Throughput Infra",
    description:
      "Layer 2 rollups optimized for millions of micro-transactions at near-zero cost, anchored to L1 for security.",
    tracks: ["Scalability"],
    glow: "bg-glow-saffron",
    color: "text-primary",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const PillarsSection = () => {
  return (
    <section className="py-24 relative">
      <div className="container px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            Five <span className="text-gradient-saffron">Pillars</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A modular platform architecture covering identity, mobility, finance,
            storage, and infrastructure—all optimized for India-scale.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {pillars.map((pillar) => (
            <motion.div
              key={pillar.title}
              variants={item}
              className={`glass rounded-2xl p-8 hover:border-primary/30 transition-all duration-300 group ${pillar.glow}`}
            >
              <div className={`w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-5 ${pillar.color} group-hover:scale-110 transition-transform`}>
                <pillar.icon className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3 text-foreground">
                {pillar.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {pillar.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {pillar.tracks.map((track) => (
                  <span
                    key={track}
                    className="text-xs px-3 py-1 rounded-full bg-secondary text-secondary-foreground"
                  >
                    {track}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PillarsSection;
