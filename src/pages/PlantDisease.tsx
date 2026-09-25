import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Bug, Upload, Camera, Leaf, AlertTriangle, Shield, Info, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import ResultCard from "@/components/ResultCard";
import Loader from "@/components/Loader";
import { toast } from "@/hooks/use-toast";

interface PredictionResult {
  disease: string;
  probability: number;
  treatment: string[];
  prevention: string[];
  severity: "Low" | "Medium" | "High";
}

const cropTypes = [
  { value: "tomato", label: "Tomato" },
  { value: "potato", label: "Potato" },
  { value: "pepper", label: "Pepper" },
  { value: "corn", label: "Corn" },
  { value: "grape", label: "Grape" },
  { value: "apple", label: "Apple" },
  { value: "strawberry", label: "Strawberry" },
  { value: "rice", label: "Rice" },
];

const diseaseDatabase: Record<string, PredictionResult[]> = {
  tomato: [
    {
      disease: "Early Blight",
      probability: 87,
      severity: "Medium",
      treatment: ["Apply copper-based fungicide", "Remove infected leaves", "Improve air circulation"],
      prevention: ["Crop rotation", "Mulching", "Avoid overhead watering"],
    },
    {
      disease: "Late Blight",
      probability: 92,
      severity: "High",
      treatment: ["Apply chlorothalonil fungicide", "Remove and destroy infected plants", "Ensure good drainage"],
      prevention: ["Use resistant varieties", "Avoid planting near potatoes", "Monitor weather conditions"],
    },
  ],
  potato: [
    {
      disease: "Potato Blight",
      probability: 89,
      severity: "High",
      treatment: ["Apply mancozeb fungicide", "Remove infected tubers", "Improve field drainage"],
      prevention: ["Use certified seed potatoes", "Crop rotation every 3 years", "Destroy volunteer plants"],
    },
  ],
  default: [
    {
      disease: "Leaf Spot Disease",
      probability: 78,
      severity: "Low",
      treatment: ["Apply neem oil spray", "Remove affected leaves", "Increase plant spacing"],
      prevention: ["Proper watering schedule", "Avoid leaf wetness", "Regular inspection"],
    },
  ],
};

// Mock prediction function
const mockPrediction = (crop: string): Promise<PredictionResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const diseases = diseaseDatabase[crop] || diseaseDatabase.default;
      const result = diseases[Math.floor(Math.random() * diseases.length)];
      resolve({
        ...result,
        probability: result.probability + (Math.random() * 10 - 5),
      });
    }, 2500);
  });
};

export default function PlantDisease() {
  const [cropType, setCropType] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid File",
          description: "Please upload an image file",
          variant: "destructive",
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!image) {
      toast({
        title: "No Image",
        description: "Please upload a plant image first",
        variant: "destructive",
      });
      return;
    }

    if (!cropType) {
      toast({
        title: "No Crop Selected",
        description: "Please select a crop type",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const prediction = await mockPrediction(cropType);
      setResult(prediction);
      toast({
        title: "Analysis Complete!",
        description: `Detected: ${prediction.disease}`,
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setImage(null);
    setResult(null);
    setCropType("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Low": return "bg-success/20 text-success";
      case "Medium": return "bg-accent/20 text-accent-foreground";
      case "High": return "bg-warning/20 text-warning";
      default: return "bg-muted text-muted-foreground";
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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent mb-6 shadow-card">
            <Bug className="w-8 h-8 text-accent-foreground" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Plant Disease Detection
          </h1>
          <p className="text-muted-foreground">
            Upload an image of your plant to detect diseases and get treatment recommendations.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className="bg-card rounded-2xl border-2 border-border p-6 shadow-card">
              <h2 className="font-display font-semibold text-xl text-foreground mb-6 flex items-center gap-2">
                <Camera className="w-5 h-5 text-primary" />
                Upload Plant Image
              </h2>

              {/* Crop Type Selection */}
              <div className="mb-6 space-y-2">
                <Label className="text-sm font-medium text-foreground">Crop Type</Label>
                <Select value={cropType} onValueChange={setCropType}>
                  <SelectTrigger className="h-12 rounded-lg border-2">
                    <SelectValue placeholder="Select crop type" />
                  </SelectTrigger>
                  <SelectContent>
                    {cropTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Image Upload Area */}
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                  image ? "border-primary bg-primary/5" : "border-border hover:border-primary hover:bg-muted/50"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {image ? (
                  <div className="relative">
                    <img
                      src={image}
                      alt="Uploaded plant"
                      className="max-h-64 mx-auto rounded-lg shadow-card"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClear();
                      }}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                      <Upload className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        Drop your image here or click to upload
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Supports JPG, PNG, WEBP (max 10MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4 mt-6">
                <Button
                  onClick={handleSubmit}
                  variant="accent"
                  size="lg"
                  className="flex-1"
                  disabled={loading || !image || !cropType}
                >
                  {loading ? (
                    <>
                      <Loader variant="dots" size="sm" text="" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Detect Disease
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleClear}
                  disabled={loading || (!image && !cropType)}
                >
                  Clear
                </Button>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-muted/50 rounded-xl p-4 border border-border">
              <h3 className="font-medium text-foreground mb-2 flex items-center gap-2">
                <Info className="w-4 h-4 text-primary" />
                Tips for Best Results
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use clear, well-lit images of the affected plant parts</li>
                <li>• Focus on leaves showing symptoms</li>
                <li>• Avoid blurry or out-of-focus photos</li>
                <li>• Include multiple angles if possible</li>
              </ul>
            </div>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {loading && (
              <div className="bg-card rounded-2xl border-2 border-border p-12 shadow-card flex items-center justify-center min-h-[400px]">
                <Loader text="Analyzing plant image..." variant="leaf" />
              </div>
            )}

            {!loading && !result && (
              <div className="bg-card rounded-2xl border-2 border-border p-12 shadow-card flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
                  <Leaf className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="font-display font-semibold text-xl text-foreground mb-2">
                  No Analysis Yet
                </h3>
                <p className="text-muted-foreground max-w-sm">
                  Upload a plant image and select the crop type to detect diseases.
                </p>
              </div>
            )}

            {!loading && result && (
              <div className="space-y-4">
                {/* Disease Detection */}
                <div className="bg-card rounded-xl border-2 border-border p-6 shadow-card">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-warning" />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-xl text-foreground">
                          {result.disease}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Detected Disease
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(result.severity)}`}>
                      {result.severity} Severity
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <span className="text-sm text-muted-foreground">Confidence:</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.probability}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-primary rounded-full"
                      />
                    </div>
                    <span className="font-semibold text-foreground">
                      {result.probability.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Treatment */}
                <div className="bg-card rounded-xl border-2 border-border p-6 shadow-card">
                  <h3 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-success" />
                    Treatment Recommendations
                  </h3>
                  <ul className="space-y-3">
                    {result.treatment.map((item, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-xs font-medium text-success">{index + 1}</span>
                        </div>
                        <p className="text-foreground text-sm">{item}</p>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Prevention */}
                <div className="bg-card rounded-xl border-2 border-border p-6 shadow-card">
                  <h3 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-primary" />
                    Prevention Tips
                  </h3>
                  <ul className="space-y-3">
                    {result.prevention.map((item, index) => (
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
                        <p className="text-foreground text-sm">{item}</p>
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