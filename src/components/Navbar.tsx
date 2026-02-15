import { motion } from "framer-motion";
import { Link } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass"
    >
      <div className="container px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Link className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">
            India<span className="text-gradient-saffron">Chain</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#pillars" className="hover:text-foreground transition-colors">Pillars</a>
          <a href="#impact" className="hover:text-foreground transition-colors">Impact</a>
          <a href="#why" className="hover:text-foreground transition-colors">Why Us</a>
          <a href="#mvp" className="hover:text-foreground transition-colors">MVP</a>
          <Button size="sm" onClick={() => navigate("/auth")}>Dashboard</Button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
