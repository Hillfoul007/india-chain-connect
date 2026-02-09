const Footer = () => {
  return (
    <footer className="border-t border-border py-12">
      <div className="container px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-display font-bold text-foreground">
          India<span className="text-gradient-saffron">Chain</span>
        </span>
        <p className="text-sm text-muted-foreground">
          Privacy-First Digital Backbone for Mobility, Trade & Financial Inclusion
        </p>
      </div>
    </footer>
  );
};

export default Footer;
