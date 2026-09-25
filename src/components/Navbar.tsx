import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Menu, X, Leaf, Droplets, Bug, Cloud, Home, LogIn, LogOut, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { farmer, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { path: "/", label: t("nav.home"), icon: Home },
    { path: "/crop-prediction", label: t("nav.cropPrediction"), icon: Leaf },
    { path: "/soil-moisture", label: t("nav.soilMoisture"), icon: Droplets },
    { path: "/plant-disease", label: t("nav.diseaseDetection"), icon: Bug },
    { path: "/weather", label: t("nav.weather"), icon: Cloud },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-border shadow-soft"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-11 h-11 rounded-xl gradient-leaf flex items-center justify-center shadow-soft group-hover:shadow-glow transition-shadow duration-300"
            >
              <Leaf className="w-5 h-5 text-primary-foreground" />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent border-2 border-background"
              />
            </motion.div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl text-foreground leading-tight">
                Agri<span className="text-primary">Smart</span>
              </span>
              <span className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase hidden sm:block">
                AI Farming
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1 bg-muted/50 rounded-full p-1.5 backdrop-blur-sm">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link to={item.path}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className={`gap-2 rounded-full transition-all duration-300 ${
                        isActive
                          ? "shadow-soft"
                          : "hover:bg-background/80"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden xl:inline">{item.label}</span>
                    </Button>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            
            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20"
                >
                  <div className="w-6 h-6 rounded-full gradient-leaf flex items-center justify-center">
                    <User className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {farmer?.name?.split(' ')[0]}
                  </span>
                </motion.div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="gap-2 rounded-full hover:bg-destructive/10 hover:text-destructive"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline">{t("nav.logout")}</span>
                </Button>
              </div>
            ) : (
              <Link to="/auth" className="hidden sm:block">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="default"
                    size="sm"
                    className="gap-2 rounded-full shadow-soft hover:shadow-glow"
                  >
                    <Sparkles className="w-4 h-4" />
                    {t("nav.login")}
                  </Button>
                </motion.div>
              </Link>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden rounded-full"
              onClick={() => setIsOpen(!isOpen)}
            >
              <motion.div
                animate={{ rotate: isOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.div>
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden"
            >
              <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                className="py-4 space-y-2 glass-card mb-4"
              >
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link to={item.path} onClick={() => setIsOpen(false)}>
                        <Button
                          variant={isActive ? "default" : "ghost"}
                          className={`w-full justify-start gap-3 rounded-xl ${
                            isActive ? "shadow-soft" : ""
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          {item.label}
                        </Button>
                      </Link>
                    </motion.div>
                  );
                })}
                <div className="pt-2 border-t border-border">
                  {isAuthenticated ? (
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 rounded-xl text-destructive hover:bg-destructive/10"
                      onClick={() => { logout(); setIsOpen(false); }}
                    >
                      <LogOut className="w-5 h-5" />
                      {t("nav.logout")}
                    </Button>
                  ) : (
                    <Link to="/auth" onClick={() => setIsOpen(false)}>
                      <Button
                        variant="default"
                        className="w-full justify-start gap-3 rounded-xl"
                      >
                        <LogIn className="w-5 h-5" />
                        {t("nav.login")}
                      </Button>
                    </Link>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
