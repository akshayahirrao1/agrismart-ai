import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Cloud, Search, MapPin, Thermometer, Droplets, Wind, Sun, CloudRain, Snowflake, CloudLightning, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ResultCard from "@/components/ResultCard";
import Loader from "@/components/Loader";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  rainProbability: number;
}

interface ForecastDay {
  day: string;
  date: string;
  high: number;
  low: number;
  description: string;
  icon: string;
}

// Mock weather data generator
const mockWeatherData = (city: string): Promise<{ current: WeatherData; forecast: ForecastDay[] }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const conditions = [
        { description: "Clear sky", icon: "sun" },
        { description: "Partly cloudy", icon: "cloud" },
        { description: "Light rain", icon: "rain" },
        { description: "Thunderstorm", icon: "storm" },
        { description: "Light snow", icon: "snow" },
      ];

      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
      const baseTemp = 20 + Math.random() * 15;

      const current: WeatherData = {
        city: city.charAt(0).toUpperCase() + city.slice(1),
        country: "India",
        temperature: Math.round(baseTemp),
        feelsLike: Math.round(baseTemp + (Math.random() * 4 - 2)),
        humidity: Math.round(40 + Math.random() * 40),
        windSpeed: Math.round(5 + Math.random() * 20),
        description: randomCondition.description,
        icon: randomCondition.icon,
        rainProbability: Math.round(Math.random() * 100),
      };

      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const today = new Date();
      
      const forecast: ForecastDay[] = Array.from({ length: 5 }, (_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() + i + 1);
        const condition = conditions[Math.floor(Math.random() * conditions.length)];
        
        return {
          day: days[date.getDay()],
          date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          high: Math.round(baseTemp + Math.random() * 5),
          low: Math.round(baseTemp - 5 - Math.random() * 5),
          description: condition.description,
          icon: condition.icon,
        };
      });

      resolve({ current, forecast });
    }, 1500);
  });
};

const WeatherIcon = ({ icon, size = "w-8 h-8" }: { icon: string; size?: string }) => {
  switch (icon) {
    case "sun":
      return <Sun className={`${size} text-accent`} />;
    case "cloud":
      return <Cloud className={`${size} text-muted-foreground`} />;
    case "rain":
      return <CloudRain className={`${size} text-sky`} />;
    case "storm":
      return <CloudLightning className={`${size} text-warning`} />;
    case "snow":
      return <Snowflake className={`${size} text-sky`} />;
    default:
      return <Sun className={`${size} text-accent`} />;
  }
};

export default function Weather() {
  const { t } = useTranslation();
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  useEffect(() => {
    // Load default weather on mount
    fetchWeather("Mumbai");
  }, []);

  const fetchWeather = async (searchCity: string) => {
    if (!searchCity.trim()) {
      toast({
        title: "Invalid City",
        description: t("weather.enterCity"),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const data = await mockWeatherData(searchCity);
      setWeatherData(data.current);
      setForecast(data.forecast);
      
      // Update search history
      setSearchHistory((prev) => {
        const updated = [searchCity, ...prev.filter((c) => c.toLowerCase() !== searchCity.toLowerCase())];
        return updated.slice(0, 5);
      });

      toast({
        title: t("common.success"),
        description: `Showing weather for ${data.current.city}`,
      });
    } catch (error) {
      toast({
        title: t("common.error"),
        description: "Failed to fetch weather data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeather(city);
    setCity("");
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-sky mb-6 shadow-card">
            <Cloud className="w-8 h-8 text-sky-foreground" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("weather.title")}
          </h1>
          <p className="text-muted-foreground">
            {t("weather.subtitle")}
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-xl mx-auto mb-8"
        >
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t("weather.enterCity")}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="h-12 pl-10 rounded-lg border-2"
              />
            </div>
            <Button type="submit" variant="sky" size="lg" disabled={loading}>
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            </Button>
          </form>

          {/* Recent Searches */}
          {searchHistory.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-sm text-muted-foreground">Recent:</span>
              {searchHistory.map((searchCity) => (
                <button
                  key={searchCity}
                  onClick={() => fetchWeather(searchCity)}
                  className="text-sm px-3 py-1 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {searchCity}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Weather Content */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader text={t("weather.searching")} variant="leaf" />
          </div>
        )}

        {!loading && weatherData && (
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Current Weather */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl border-2 border-border p-8 shadow-card"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    <h2 className="font-display font-bold text-2xl text-foreground">
                      {weatherData.city}, {weatherData.country}
                    </h2>
                  </div>
                  <p className="text-muted-foreground">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full gradient-sky flex items-center justify-center shadow-card">
                    <WeatherIcon icon={weatherData.icon} size="w-12 h-12" />
                  </div>
                  <div className="text-center">
                    <p className="font-display text-6xl font-bold text-foreground">
                      {weatherData.temperature}°
                    </p>
                    <p className="text-muted-foreground">{weatherData.description}</p>
                  </div>
                </div>
              </div>

              {/* Weather Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <div className="bg-muted/50 rounded-xl p-4 text-center">
                  <Thermometer className="w-6 h-6 mx-auto text-warning mb-2" />
                  <p className="text-sm text-muted-foreground">{t("weather.temperature")}</p>
                  <p className="font-display font-bold text-xl text-foreground">
                    {weatherData.feelsLike}°C
                  </p>
                </div>
                <div className="bg-muted/50 rounded-xl p-4 text-center">
                  <Droplets className="w-6 h-6 mx-auto text-sky mb-2" />
                  <p className="text-sm text-muted-foreground">{t("weather.humidity")}</p>
                  <p className="font-display font-bold text-xl text-foreground">
                    {weatherData.humidity}%
                  </p>
                </div>
                <div className="bg-muted/50 rounded-xl p-4 text-center">
                  <Wind className="w-6 h-6 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">{t("weather.wind")}</p>
                  <p className="font-display font-bold text-xl text-foreground">
                    {weatherData.windSpeed} km/h
                  </p>
                </div>
                <div className="bg-muted/50 rounded-xl p-4 text-center">
                  <CloudRain className="w-6 h-6 mx-auto text-sky mb-2" />
                  <p className="text-sm text-muted-foreground">{t("weather.rainfall")}</p>
                  <p className="font-display font-bold text-xl text-foreground">
                    {weatherData.rainProbability}%
                  </p>
                </div>
              </div>
            </motion.div>

            {/* 5-Day Forecast */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="font-display font-semibold text-xl text-foreground mb-4">
                {t("weather.forecast")}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {forecast.map((day, index) => (
                  <motion.div
                    key={day.day}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="bg-card rounded-xl border-2 border-border p-4 text-center shadow-soft hover:shadow-card transition-shadow"
                  >
                    <p className="font-medium text-foreground">{day.day}</p>
                    <p className="text-xs text-muted-foreground mb-3">{day.date}</p>
                    <div className="w-12 h-12 mx-auto rounded-full bg-muted flex items-center justify-center mb-3">
                      <WeatherIcon icon={day.icon} size="w-6 h-6" />
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{day.description}</p>
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-semibold text-foreground">{day.high}°</span>
                      <span className="text-muted-foreground">{day.low}°</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Farming Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-primary/5 rounded-2xl border-2 border-primary/20 p-6"
            >
              <h3 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
                <Sun className="w-5 h-5 text-accent" />
                {t("weather.farmingTips")}
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {weatherData.rainProbability > 60 ? (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-sky/20 flex items-center justify-center shrink-0">
                      <CloudRain className="w-4 h-4 text-sky" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Rain Expected</p>
                      <p className="text-sm text-muted-foreground">
                        Delay irrigation and prepare for drainage management.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center shrink-0">
                      <Droplets className="w-4 h-4 text-success" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Good for Irrigation</p>
                      <p className="text-sm text-muted-foreground">
                        Low rain probability - proceed with regular watering schedule.
                      </p>
                    </div>
                  </div>
                )}
                
                {weatherData.temperature > 30 ? (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-warning/20 flex items-center justify-center shrink-0">
                      <Thermometer className="w-4 h-4 text-warning" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">High Temperature Alert</p>
                      <p className="text-sm text-muted-foreground">
                        Consider shade nets and increase watering frequency.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                      <Sun className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Ideal Conditions</p>
                      <p className="text-sm text-muted-foreground">
                        Temperature is optimal for most crop activities.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
