const Footer = () => {
  return (
    <div>
      <footer className="border-t-4 border-border bg-card mt-20">
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary rounded-full border-4 border-border flex items-center justify-center">
                <span className="text-xl">☕</span>
              </div>
              <div>
                <div className="text-foreground font-normal">TeaTalks</div>
                <div className="text-xs text-muted-foreground">
                  © 2026 • Made With Love for HMR College
                </div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground font-normal">
              Stay cool. Stay connected. Spill the tea. ✌️
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
