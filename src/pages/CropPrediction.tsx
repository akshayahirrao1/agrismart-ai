import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, Thermometer, Droplets, TestTube, CloudRain, Info, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import InputField from "@/components/InputField";
import ResultCard from "@/components/ResultCard";
import Loader from "@/components/Loader";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { predictCrop as predictCropApi } from "@/services/api";
import { useTranslation } from "react-i18next";

interface FormData {
  nitrogen: string;
  phosphorus: string;
  potassium: string;
  temperature: string;
  humidity: string;
  ph: string;
  rainfall: string;
}

interface PredictionResult {
  crop: string;
  confidence: number;
  season: string;
  tips: string[];
}

const initialFormData: FormData = {
  nitrogen: "",
  phosphorus: "",
  potassium: "",
  temperature: "",
  humidity: "",
  ph: "",
  rainfall: "",
};

const CROP_INFO: Record<string, { season: string; tips: string[] }> = {
  rice: { season: "Kharif (Monsoon)", tips: ["Requires standing water", "Best planted in June-July", "Harvest after 4-5 months"] },
  maize: { season: "Kharif/Rabi", tips: ["Grows well in warm weather", "Needs 500-800mm rainfall", "60-100 days to harvest"] },
  chickpea: { season: "Rabi (Winter)", tips: ["Drought tolerant crop", "Sow in October-November", "Avoid waterlogged soil"] },
  kidneybeans: { season: "Kharif", tips: ["Needs well-drained loamy soil", "Sensitive to frost", "90-120 days to maturity"] },
  pigeonpeas: { season: "Kharif", tips: ["Deep-rooted, drought resistant", "Sow with onset of monsoon", "150-180 days crop duration"] },
  mothbeans: { season: "Kharif", tips: ["Highly drought tolerant", "Grows well in sandy soil", "60-90 days to harvest"] },
  mungbean: { season: "Kharif/Summer", tips: ["Short duration crop", "Needs warm climate", "60-70 days to harvest"] },
  blackgram: { season: "Kharif/Rabi", tips: ["Prefers clayey loam soil", "Sensitive to waterlogging", "70-90 days to maturity"] },
  lentil: { season: "Rabi (Winter)", tips: ["Cool season crop", "Sow in October-November", "Low water requirement"] },
  pomegranate: { season: "Year-round (best in Feb/Jun/Oct)", tips: ["Thrives in semi-arid climate", "Well-drained soil essential", "Fruits in 5-7 months"] },
  banana: { season: "Year-round", tips: ["Needs consistent irrigation", "Rich, well-drained soil", "10-12 months to first harvest"] },
  mango: { season: "Flowering: Dec-Feb", tips: ["Deep, well-drained soil", "Minimal water once established", "3-5 years to first fruiting"] },
  grapes: { season: "Pruning: Oct-Dec", tips: ["Needs strong sunlight", "Well-drained sandy loam", "Trellising required"] },
  watermelon: { season: "Summer", tips: ["Needs sandy, well-drained soil", "High water requirement", "80-100 days to harvest"] },
  muskmelon: { season: "Summer", tips: ["Warm season crop", "Needs full sun exposure", "70-90 days to harvest"] },
  apple: { season: "Flowering: Mar-Apr", tips: ["Needs cold winters (chilling hours)", "Well-drained loamy soil", "3-5 years to first fruiting"] },
  orange: { season: "Flowering: Jan-Mar", tips: ["Prefers subtropical climate", "Well-drained sandy loam", "3-4 years to first fruiting"] },
  papaya: { season: "Year-round", tips: ["Fast-growing, fruits within a year", "Needs good drainage", "Sensitive to frost"] },
  coconut: { season: "Year-round", tips: ["Needs coastal/humid climate", "Deep sandy loam soil", "6-8 years to first yield"] },
  cotton: { season: "Kharif", tips: ["Requires black soil", "150-200 days crop duration", "Sensitive to waterlogging"] },
  jute: { season: "Kharif (Mar-Jul)", tips: ["Needs warm, humid climate", "Alluvial soil preferred", "120-150 days to harvest"] },
  coffee: { season: "Flowering: Mar-Apr", tips: ["Needs shade and cool climate", "Well-drained, slightly acidic soil", "3-4 years to first yield"] },
};

const getCropInfo = (cropName: string) => {
  const key = cropName.toLowerCase().trim();
  return CROP_INFO[key] ?? { season: "Varies by region", tips: ["Consult a local agricultural extension for detailed growing guidance."] };
};

export default function CropPrediction() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.nitrogen || parseFloat(formData.nitrogen) < 0 || parseFloat(formData.nitrogen) > 140) {
      newErrors.nitrogen = "Nitrogen must be between 0-140 kg/ha";
    }
    if (!formData.phosphorus || parseFloat(formData.phosphorus) < 0 || parseFloat(formData.phosphorus) > 145) {
      newErrors.phosphorus = "Phosphorus must be between 0-145 kg/ha";
    }
    if (!formData.potassium || parseFloat(formData.potassium) < 0 || parseFloat(formData.potassium) > 205) {
      newErrors.potassium = "Potassium must be between 0-205 kg/ha";
    }
    if (!formData.temperature || parseFloat(formData.temperature) < -10 || parseFloat(formData.temperature) > 50) {
      newErrors.temperature = "Temperature must be between -10°C to 50°C";
    }
    if (!formData.humidity || parseFloat(formData.humidity) < 0 || parseFloat(formData.humidity) > 100) {
      newErrors.humidity = "Humidity must be between 0-100%";
    }
    if (!formData.ph || parseFloat(formData.ph) < 0 || parseFloat(formData.ph) > 14) {
      newErrors.ph = "pH must be between 0-14";
    }
    if (!formData.rainfall || parseFloat(formData.rainfall) < 0 || parseFloat(formData.rainfall) > 3000) {
      newErrors.rainfall = "Rainfall must be between 0-3000mm";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast({
        title: "Please sign in",
        description: "You need an account to get crop predictions.",
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
      const prediction = await predictCropApi({
        N: parseFloat(formData.nitrogen),
        P: parseFloat(formData.phosphorus),
        K: parseFloat(formData.potassium),
        temperature: parseFloat(formData.temperature),
        humidity: parseFloat(formData.humidity),
        ph: parseFloat(formData.ph),
        rainfall: parseFloat(formData.rainfall),
      });

      const info = getCropInfo(prediction.predictedCrop);
      setResult({
        crop: prediction.predictedCrop,
        confidence: prediction.confidence,
        season: info.season,
        tips: info.tips,
      });
      toast({
        title: t("common.success"),
        description: `${t("crop.result")}: ${prediction.predictedCrop}`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : t("common.error");
      toast({
        title: "Prediction Failed",
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

  return (
    <div className="min-h-screen pt-20 pb-12 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-leaf mb-6 shadow-glow">
            <Leaf className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("crop.title")}
          </h1>
          <p className="text-muted-foreground">
            {t("crop.subtitle")}
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
                <TestTube className="w-5 h-5 text-primary" />
                {t("crop.title")}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label={t("crop.nitrogen")}
                    type="number"
                    placeholder="0-140"
                    value={formData.nitrogen}
                    onChange={handleInputChange("nitrogen")}
                    error={errors.nitrogen}
                    hint="kg/ha"
                    icon={<TestTube className="w-4 h-4" />}
                  />
                  <InputField
                    label={t("crop.phosphorus")}
                    type="number"
                    placeholder="0-145"
                    value={formData.phosphorus}
                    onChange={handleInputChange("phosphorus")}
                    error={errors.phosphorus}
                    hint="kg/ha"
                    icon={<TestTube className="w-4 h-4" />}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label={t("crop.potassium")}
                    type="number"
                    placeholder="0-205"
                    value={formData.potassium}
                    onChange={handleInputChange("potassium")}
                    error={errors.potassium}
                    hint="kg/ha"
                    icon={<TestTube className="w-4 h-4" />}
                  />
                  <InputField
                    label={t("crop.temperature")}
                    type="number"
                    placeholder="20-35"
                    value={formData.temperature}
                    onChange={handleInputChange("temperature")}
                    error={errors.temperature}
                    hint=""
                    icon={<Thermometer className="w-4 h-4" />}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label={t("crop.humidity")}
                    type="number"
                    placeholder="0-100"
                    value={formData.humidity}
                    onChange={handleInputChange("humidity")}
                    error={errors.humidity}
                    hint=""
                    icon={<Droplets className="w-4 h-4" />}
                  />
                  <InputField
                    label={t("crop.ph")}
                    type="number"
                    step="0.1"
                    placeholder="0-14"
                    value={formData.ph}
                    onChange={handleInputChange("ph")}
                    error={errors.ph}
                    hint=""
                    icon={<Info className="w-4 h-4" />}
                  />
                </div>

                <InputField
                  label={t("crop.rainfall")}
                  type="number"
                  placeholder="0-3000"
                  value={formData.rainfall}
                  onChange={handleInputChange("rainfall")}
                  error={errors.rainfall}
                  hint=""
                  icon={<CloudRain className="w-4 h-4" />}
                />

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="flex-1"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader variant="dots" size="sm" text="" />
                        {t("crop.predicting")}
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        {t("crop.predict")}
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
                    {t("common.cancel")}
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
                <Loader text={t("crop.predicting")} />
              </div>
            )}

            {!loading && !result && (
              <div className="bg-card rounded-2xl border-2 border-border p-12 shadow-card flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
                  <Leaf className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="font-display font-semibold text-xl text-foreground mb-2">
                  No Prediction Yet
                </h3>
                <p className="text-muted-foreground max-w-sm">
                  {t("crop.subtitle")}
                </p>
              </div>
            )}

            {!loading && result && (
              <div className="space-y-4">
                <ResultCard
                  title={t("crop.result")}
                  value={result.crop}
                  icon={<Leaf className="w-6 h-6" />}
                  variant="primary"
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <ResultCard
                    title={t("crop.confidence")}
                    value={`${result.confidence.toFixed(1)}%`}
                    icon={<Sparkles className="w-5 h-5" />}
                    variant="success"
                  />
                  <ResultCard
                    title={t("crop.season")}
                    value={result.season}
                    icon={<CloudRain className="w-5 h-5" />}
                    variant="accent"
                  />
                </div>

                <div className="bg-card rounded-xl border-2 border-border p-6 shadow-card">
                  <h3 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-primary" />
                    {t("crop.tips")}
                  </h3>
                  <ul className="space-y-3">
                    {result.tips.map((tip, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-xs font-medium text-primary">{index + 1}</span>
                        </div>
                        <p className="text-foreground text-sm">{tip}</p>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}