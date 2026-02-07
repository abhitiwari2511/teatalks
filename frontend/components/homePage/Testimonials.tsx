import * as motion from "motion/react-client";

const Testimonials = () => {
  return (
    <div>
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl text-foreground italic text-center mb-12">
            Real Students, Real Vibes
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Priya S.",
                role: "CS Senior",
                text: "Finally found my people! Best decision ever joining TeaTalks 🔥",
                avatar: "🧑‍💻",
                color: "bg-secondary",
              },
              {
                name: "Arjun M.",
                role: "ECE Sophomore",
                text: "From memes to study groups, everything I need is here. 10/10 would recommend",
                avatar: "😎",
                color: "bg-accent",
              },
              {
                name: "Sneha K.",
                role: "MBA Freshman",
                text: "The group chat we all needed but didn't know about. Life saver during exams!",
                avatar: "📚",
                color: "bg-[#FFE66D]",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border-4 border-border rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:rotate-2 transition-transform"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-12 h-12 ${testimonial.color} rounded-full border-4 border-border flex items-center justify-center text-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
                  >
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="text-foreground italic">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
                <p className="text-foreground italic">
                  &quot;{testimonial.text}&quot;
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Testimonials;
