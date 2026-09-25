import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Droplets, Thermometer, CloudRain, Layers, Info, Sparkles, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import InputField from "@/components/InputField";
import ResultCard from "@/components/ResultCard";
import Loader from "@/components/Loader";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { predictSoilMoisture as predictSoilMoistureApi, SoilType } from "@/services/api";

interface FormData {
  soilType: string;
  temperature: string;
  humidity: string;
  rainfall: string;
}

interface PredictionResult {
  moistureLevel: "Low" | "Medium" | "High";
  moisturePercentage: number;
  irrigationNeeded: boolean;
  recommendation: string;
  waterAmount: string;
}

// These must exactly match the soil types the model was trained on
// (backend/ml_service/dataset/soil_moisture.csv), and the case-sensitive
// enum the backend now accepts (see backend/src/controllers/soil.controller.js).
const soilTypes: { value: SoilType; label: string }[] = [
  { value: "Alluvial", label: "Alluvial Soil" },
  { value: "Black", label: "Black Soil" },
  { value: "Clay", label: "Clay Soil" },
  { value: "Laterite", label: "Laterite Soil" },
  { value: "Loamy", label: "Loamy Soil" },
  { value: "Red", label: "Red Soil" },
  { value: "Sandy", label: "Sandy Soil" },
];

const initialFormData: FormData = {
  soilType: "",
  temperature: "",
  humidity: "",
  rainfall: "",
};

// The model outputs a single 0-100-ish moisture number and nothing else.
// These heuristics (category, irrigation flag, water amount) are derived
// client-side from that number — not something the model predicts.
const classifyMoisture = (pct: number): "Low" | "Medium" | "High" => {
  if (pct < 30) return "Low";
  if (pct < 60) return "Medium";
  return "High";
};

const getWaterAmount = (pct: number): string => {
  if (pct < 30) return "25-30 liters per m²";
  if (pct < 50) return "10-15 liters per m²";
  return "No irrigation needed";
};

export default function SoilMoisture() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.soilType) {
      newErrors.soilType = "Please select a soil type";
    }
    if (!formData.temperature || parseFloat(formData.temperature) < -10 || parseFloat(formData.temperature) > 50) {
      newErrors.temperature = "Temperature must be between -10°C to 50°C";
    }
    if (!formData.humidity || parseFloat(formData.humidity) < 0 || parseFloat(formData.humidity) > 100) {
      newErrors.humidity = "Humidity must be between 0-100%";
    }
    if (!formData.rainfall || parseFloat(formData.rainfall) < 0) {
      newErrors.rainfall = "Rainfall must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast({
        title: "Please sign in",
        description: "You need an account to get soil moisture predictions.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const prediction = await predictSoilMoistureApi({
        soilType: formData.soilType as SoilType,
        temperature: parseFloat(formData.temperature),
        humidity: parseFloat(formData.humidity),
        rainfall: parseFloat(formData.rainfall),
      });

      const moisturePercentage = Math.min(100, Math.max(0, prediction.moistureLevel));
      const moistureLevel = classifyMoisture(moisturePercentage);

      setResult({
        moistureLevel,
        moisturePercentage,
        irrigationNeeded: moisturePercentage < 50,
        recommendation: prediction.irrigationSuggestion,
        waterAmount: getWaterAmount(moisturePercentage),
      });
      toast({
        title: "Analysis Complete!",
        description: `Soil moisture: ${moistureLevel}`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to analyze soil moisture. Please try again.";
      toast({
        title: "Analysis Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setResult(null);
    setErrors({});
  };

  const getMoistureColor = (level: string) => {
    switch (level) {
      case "Low": return "bg-warning";
      case "Medium": return "bg-accent";
      case "High": return "bg-sky";
      default: return "bg-muted";
    }
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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-soil mb-6 shadow-card">
            <Droplets className="w-8 h-8 text-soil-foreground" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Soil Moisture Analysis
          </h1>
          <p className="text-muted-foreground">
            Predict soil moisture levels and get smart irrigation recommendations 
            based on environmental conditions.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-card rounded-2xl border-2 border-border p-6 shadow-card">
              <h2 className="font-display font-semibold text-xl text-foreground mb-6 flex items-center gap-2">
                <Layers className="w-5 h-5 text-soil" />
                Environmental Parameters
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Soil Type</Label>
                  <Select
                    value={formData.soilType}
                    onValueChange={(value) => {
                      setFormData((prev) => ({ ...prev, soilType: value }));
                      if (errors.soilType) {
                        setErrors((prev) => ({ ...prev, soilType: undefined }));
                      }
                    }}
                  >
                    <SelectTrigger className="h-12 rounded-lg border-2">
                      <SelectValue placeholder="Select soil type" />
                    </SelectTrigger>
                    <SelectContent>
                      {soilTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.soilType && (
                    <p className="text-xs text-destructive">{errors.soilType}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="Temperature"
                    type="number"
                    placeholder="20-35"
                    value={formData.temperature}
                    onChange={handleInputChange("temperature")}
                    error={errors.temperature}
                    hint="°C"
                    icon={<Thermometer className="w-4 h-4" />}
                  />
                  <InputField
                    label="Humidity"
                    type="number"
                    placeholder="0-100"
                    value={formData.humidity}
                    onChange={handleInputChange("humidity")}
                    error={errors.humidity}
                    hint="%"
                    icon={<Droplets className="w-4 h-4" />}
                  />
                </div>

                <InputField
                  label="Recent Rainfall"
                  type="number"
                  placeholder="0-500"
                  value={formData.rainfall}
                  onChange={handleInputChange("rainfall")}
                  error={errors.rainfall}
                  hint="mm (last 7 days)"
                  icon={<CloudRain className="w-4 h-4" />}
                />

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    variant="soil"
                    size="lg"
                    className="flex-1"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader variant="dots" size="sm" text="" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Predict Moisture
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={handleReset}
                    disabled={loading}
                  >
                    Reset
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {loading && (
              <div className="bg-card rounded-2xl border-2 border-border p-12 shadow-card flex items-center justify-center min-h-[400px]">
                <Loader text="Analyzing soil conditions..." variant="leaf" />
              </div>
            )}

            {!loading && !result && (
              <div className="bg-card rounded-2xl border-2 border-border p-12 shadow-card flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
                  <Droplets className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="font-display font-semibold text-xl text-foreground mb-2">
                  No Analysis Yet
                </h3>
                <p className="text-muted-foreground max-w-sm">
                  Enter environmental parameters to predict soil moisture levels.
                </p>
              </div>
            )}

            {!loading && result && (
              <div className="space-y-4">
                {/* Moisture Gauge */}
                <div className="bg-card rounded-xl border-2 border-border p-6 shadow-card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display font-semibold text-lg text-foreground">
                      Moisture Level
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      result.moistureLevel === "Low" ? "bg-warning/20 text-warning" :
                      result.moistureLevel === "Medium" ? "bg-accent/20 text-accent-foreground" :
                      "bg-sky/20 text-sky"
                    }`}>
                      {result.moistureLevel}
                    </span>
                  </div>
                  
                  <div className="relative pt-2">
                    <Progress 
                      value={result.moisturePercentage} 
                      className="h-4 rounded-full"
                    />
                    <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                      <span>0%</span>
                      <span className="font-semibold text-foreground text-base">
                        {result.moisturePercentage.toFixed(1)}%
                      </span>
                      <span>100%</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4 text-sm">
                    <div className="w-3 h-3 rounded-full bg-warning" />
                    <span className="text-muted-foreground">Low (0-30%)</span>
                    <div className="w-3 h-3 rounded-full bg-accent ml-4" />
                    <span className="text-muted-foreground">Medium (30-60%)</span>
                    <div className="w-3 h-3 rounded-full bg-sky ml-4" />
                    <span className="text-muted-foreground">High (60-100%)</span>
                  </div>
                </div>

                {/* Irrigation Status */}
                <ResultCard
                  title="Irrigation Status"
                  value={result.irrigationNeeded ? "Irrigation Needed" : "No Irrigation Needed"}
                  subtitle={result.waterAmount}
                  icon={result.irrigationNeeded ? 
                    <AlertTriangle className="w-6 h-6" /> : 
                    <CheckCircle2 className="w-6 h-6" />
                  }
                  variant={result.irrigationNeeded ? "warning" : "success"}
                />

                {/* Recommendation */}
                <div className="bg-card rounded-xl border-2 border-border p-6 shadow-card">
                  <h3 className="font-display font-semibold text-lg text-foreground mb-3 flex items-center gap-2">
                    <Info className="w-5 h-5 text-primary" />
                    Recommendation
                  </h3>
                  <p className="text-foreground">{result.recommendation}</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}