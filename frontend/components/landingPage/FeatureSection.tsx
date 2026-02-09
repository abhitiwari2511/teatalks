import * as motion from "motion/react-client";

const FeatureSection = () => {
  const features = [
    {
      icon: "🎓",
      title: "Verified Students Only",
      description:
        "Only @abc.ac.in emails allowed. No randos, just your college fam.",
    },
    {
      icon: "💬",
      title: "Unlimited Gossip",
      description:
        "Spill the tea, share memes, rant about profs. This is YOUR space.",
    },
    {
      icon: "🔥",
      title: "What's Hot",
      description:
        "Never miss campus drama, events, or that surprise quiz alert.",
    },
    {
      icon: "⚡",
      title: "Lightning Fast",
      description:
        "Real-time updates. Blink and you might miss the next viral post.",
    },
  ];
  
  return (
    <div>
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl text-foreground italic mb-4">
            Why You&apos;ll Love It Here
          </h2>
          <p className="text-xl text-muted-foreground">
            (Besides the obvious fact that everyone else is here)
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border-4 border-border rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.75 hover:translate-y-0.75 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl text-foreground mb-2 italic">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;
