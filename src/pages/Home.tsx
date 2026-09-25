import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Leaf, Droplets, Bug, Cloud, ArrowRight, Sparkles, TrendingUp, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import FeatureCard from "@/components/FeatureCard";

export default function Home() {
  const features = [
    {
      title: "Crop Recommendation",
      description: "AI-powered predictions to help you choose the optimal crop based on soil and weather conditions.",
      icon: <Leaf className="w-6 h-6" />,
      href: "/crop-prediction",
      variant: "primary" as const,
    },
    {
      title: "Soil Moisture Analysis",
      description: "Monitor and predict soil moisture levels to optimize irrigation and water usage.",
      icon: <Droplets className="w-6 h-6" />,
      href: "/soil-moisture",
      variant: "soil" as const,
    },
    {
      title: "Disease Detection",
      description: "Upload plant images to instantly detect diseases and get treatment recommendations.",
      icon: <Bug className="w-6 h-6" />,
      href: "/plant-disease",
      variant: "accent" as const,
    },
    {
      title: "Weather Forecast",
      description: "Real-time weather updates and forecasts to plan your farming activities effectively.",
      icon: <Cloud className="w-6 h-6" />,
      href: "/weather",
      variant: "sky" as const,
    },
  ];

  const stats = [
    { value: "95%", label: "Prediction Accuracy" },
    { value: "50K+", label: "Farmers Helped" },
    { value: "120+", label: "Crop Varieties" },
    { value: "24/7", label: "Support Available" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 gradient-hero opacity-90" />
        <div className="absolute inset-0 leaf-pattern" />
        
        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-16 h-16 rounded-full bg-accent/30 blur-xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-32 right-20 w-24 h-24 rounded-full bg-primary-glow/30 blur-xl"
        />

        <div className="container mx-auto px-4 relative z-10 pt-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6"
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-primary-foreground/90 text-sm font-medium">
                AI-Powered Agriculture Platform
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight"
            >
              Smart Farming,
              <br />
              <span className="text-accent">Brighter Future</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto"
            >
              Harness the power of artificial intelligence to make data-driven decisions 
              for crop selection, soil management, and disease prevention.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/crop-prediction">
                <Button variant="accent" size="xl" className="w-full sm:w-auto">
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/weather">
                <Button 
                  variant="outline" 
                  size="xl" 
                  className="w-full sm:w-auto border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                >
                  Check Weather
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-3xl mx-auto"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">
                  {stat.value}
                </p>
                <p className="text-primary-foreground/70 text-sm">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 rounded-full bg-primary-foreground/50" />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background relative">
        <div className="absolute inset-0 leaf-pattern opacity-30" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Powerful Features for Modern Farming
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our AI-driven tools help you make informed decisions at every step of the farming process.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                {...feature}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                Why Choose AgriSmart?
              </h2>
              <div className="space-y-6">
                {[
                  {
                    icon: <TrendingUp className="w-5 h-5" />,
                    title: "Increase Crop Yield",
                    description: "Make data-driven decisions that maximize your harvest potential.",
                  },
                  {
                    icon: <Shield className="w-5 h-5" />,
                    title: "Reduce Risks",
                    description: "Early disease detection and weather alerts protect your investment.",
                  },
                  {
                    icon: <Droplets className="w-5 h-5" />,
                    title: "Optimize Resources",
                    description: "Smart irrigation suggestions help conserve water and reduce costs.",
                  },
                ].map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl gradient-leaf flex items-center justify-center shrink-0">
                      <div className="text-primary-foreground">{benefit.icon}</div>
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-foreground mb-1">
                        {benefit.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {benefit.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl gradient-hero overflow-hidden shadow-card">
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    className="w-64 h-64 border-2 border-primary-foreground/20 rounded-full"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    className="absolute w-48 h-48 border-2 border-primary-foreground/30 rounded-full"
                  />
                  <div className="absolute w-20 h-20 gradient-leaf rounded-full flex items-center justify-center shadow-glow">
                    <Leaf className="w-10 h-10 text-primary-foreground" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Ready to Transform Your Farm?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of farmers who are already using AgriSmart to improve their yields 
              and make smarter agricultural decisions.
            </p>
            <Link to="/crop-prediction">
              <Button variant="hero" size="xl">
                Start Predicting Now
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
