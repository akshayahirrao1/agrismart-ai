import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  variant?: "primary" | "accent" | "sky" | "soil";
  delay?: number;
}

const gradientStyles = {
  primary: "gradient-leaf",
  accent: "bg-accent",
  sky: "gradient-sky",
  soil: "gradient-soil",
};

const hoverGlowStyles = {
  primary: "group-hover:shadow-[0_0_60px_hsl(145_50%_60%/0.4)]",
  accent: "group-hover:shadow-[0_0_60px_hsl(42_75%_55%/0.4)]",
  sky: "group-hover:shadow-[0_0_60px_hsl(200_70%_55%/0.4)]",
  soil: "group-hover:shadow-[0_0_60px_hsl(25_40%_35%/0.4)]",
};

const borderHoverStyles = {
  primary: "group-hover:border-primary/60",
  accent: "group-hover:border-accent/60",
  sky: "group-hover:border-sky/60",
  soil: "group-hover:border-soil/60",
};

export default function FeatureCard({
  title,
  description,
  icon,
  href,
  variant = "primary",
  delay = 0,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      <Link to={href} className="block group">
        <motion.div
          whileHover={{ y: -8, scale: 1.02 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "relative bg-card rounded-3xl p-6 border-2 border-border shadow-card overflow-hidden transition-all duration-500",
            borderHoverStyles[variant]
          )}
        >
          {/* Animated Background Gradient */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          </div>
          
          {/* Background Pattern */}
          <div className="absolute inset-0 leaf-pattern opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
          
          {/* Decorative Circle */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 0.1 }}
            transition={{ delay: delay + 0.2, duration: 0.5 }}
            className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary"
          />
          
          <div className="relative z-10">
            {/* Icon */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-all duration-500",
                gradientStyles[variant],
                hoverGlowStyles[variant]
              )}
            >
              <div className="text-primary-foreground">{icon}</div>
            </motion.div>

            {/* Content */}
            <h3 className="font-display font-bold text-xl text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
              {title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-5">
              {description}
            </p>

            {/* CTA */}
            <div className="flex items-center text-primary font-semibold text-sm">
              <span className="relative">
                Explore
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="ml-2"
              >
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
