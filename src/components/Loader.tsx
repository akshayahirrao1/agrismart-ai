import { motion } from "framer-motion";
import { Loader2, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  text?: string;
  variant?: "spinner" | "leaf" | "dots";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Loader({
  text = "Loading...",
  variant = "leaf",
  size = "md",
  className,
}: LoaderProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      {variant === "spinner" && (
        <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      )}

      {variant === "leaf" && (
        <motion.div
          animate={{
            rotate: [0, 10, -10, 10, 0],
            scale: [1, 1.1, 1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={cn(
            "rounded-full gradient-leaf flex items-center justify-center shadow-glow",
            size === "sm" && "w-10 h-10",
            size === "md" && "w-14 h-14",
            size === "lg" && "w-20 h-20"
          )}
        >
          <Leaf className={cn("text-primary-foreground", sizeClasses[size])} />
        </motion.div>
      )}

      {variant === "dots" && (
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className={cn(
                "rounded-full bg-primary",
                size === "sm" && "w-2 h-2",
                size === "md" && "w-3 h-3",
                size === "lg" && "w-4 h-4"
              )}
            />
          ))}
        </div>
      )}

      {text && (
        <p className={cn("text-muted-foreground font-medium", textSizeClasses[size])}>
          {text}
        </p>
      )}
    </div>
  );
}
