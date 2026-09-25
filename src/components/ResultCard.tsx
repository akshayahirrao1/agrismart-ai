import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ResultCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  variant?: "default" | "primary" | "accent" | "success" | "warning" | "sky" | "soil";
  className?: string;
}

const variantStyles = {
  default: "bg-card border-border",
  primary: "bg-primary/10 border-primary/30",
  accent: "bg-accent/10 border-accent/30",
  success: "bg-success/10 border-success/30",
  warning: "bg-warning/10 border-warning/30",
  sky: "bg-sky/10 border-sky/30",
  soil: "bg-soil/10 border-soil/30",
};

const iconStyles = {
  default: "bg-muted text-foreground",
  primary: "bg-primary text-primary-foreground",
  accent: "bg-accent text-accent-foreground",
  success: "bg-success text-success-foreground",
  warning: "bg-warning text-warning-foreground",
  sky: "bg-sky text-sky-foreground",
  soil: "bg-soil text-soil-foreground",
};

export default function ResultCard({
  title,
  value,
  subtitle,
  icon,
  variant = "default",
  className,
}: ResultCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "rounded-xl border-2 p-6 shadow-card",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start gap-4">
        {icon && (
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
              iconStyles[variant]
            )}
          >
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-display font-bold text-foreground truncate">
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
