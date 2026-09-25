// import axios, { AxiosError } from "axios";

// // ---------------------------------------------------------------------------
// // Base client
// // ---------------------------------------------------------------------------
// // Points at the Node/Express backend (backend/src), NOT the Python ML service
// // directly. The backend proxies crop/soil predictions to the ML service and
// // persists history in MongoDB.
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// export const TOKEN_KEY = "agrismart_token";

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Attach JWT to every request if we have one
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem(TOKEN_KEY);
//   if (token && config.headers) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // Normalize backend error shape { success: false, message } into a plain Error
// const unwrapError = (error: unknown): never => {
//   if (axios.isAxiosError(error)) {
//     const axiosErr = error as AxiosError<{ message?: string; errors?: { field: string; message: string }[] }>;
//     const message =
//       axiosErr.response?.data?.message ||
//       axiosErr.response?.data?.errors?.map((e) => e.message).join(", ") ||
//       axiosErr.message;
//     throw new Error(message);
//   }
//   throw error instanceof Error ? error : new Error("Unknown error");
// };

// // Generic envelope the backend wraps every response in
// interface ApiEnvelope<T> {
//   success: boolean;
//   message?: string;
//   data: T;
// }

// // ---------------------------------------------------------------------------
// // Auth
// // ---------------------------------------------------------------------------
// export interface AuthUser {
//   id: string;
//   name: string;
//   email: string;
//   role: "admin" | "user";
//   createdAt?: string;
// }

// export interface RegisterInput {
//   name: string;
//   email: string;
//   password: string;
//   role?: "admin" | "user";
// }

// export interface LoginInput {
//   email: string;
//   password: string;
// }

// export const registerUser = async (data: RegisterInput): Promise<{ token: string; user: AuthUser }> => {
//   try {
//     const res = await api.post<ApiEnvelope<{ token: string; user: AuthUser }>>("/auth/register", data);
//     return res.data.data;
//   } catch (e) {
//     return unwrapError(e);
//   }
// };

// export const loginUser = async (data: LoginInput): Promise<{ token: string; user: AuthUser }> => {
//   try {
//     const res = await api.post<ApiEnvelope<{ token: string; user: AuthUser }>>("/auth/login", data);
//     return res.data.data;
//   } catch (e) {
//     return unwrapError(e);
//   }
// };

// export const getCurrentUser = async (): Promise<AuthUser> => {
//   try {
//     const res = await api.get<ApiEnvelope<AuthUser>>("/auth/me");
//     return res.data.data;
//   } catch (e) {
//     return unwrapError(e);
//   }
// };

// // ---------------------------------------------------------------------------
// // Crop Prediction
// // ---------------------------------------------------------------------------
// export interface CropPredictionInput {
//   N: number;
//   P: number;
//   K: number;
//   temperature: number;
//   humidity: number;
//   ph: number;
//   rainfall: number;
// }

// export interface CropPredictionResult {
//   id: string;
//   predictedCrop: string;
//   confidence: number;
//   inputs: CropPredictionInput;
//   createdAt: string;
// }

// export const predictCrop = async (data: CropPredictionInput): Promise<CropPredictionResult> => {
//   try {
//     const res = await api.post<ApiEnvelope<{ prediction: CropPredictionResult }>>("/crop/predict", data);
//     return res.data.data.prediction;
//   } catch (e) {
//     return unwrapError(e);
//   }
// };

// export const getCropHistory = async (page = 1, limit = 10) => {
//   try {
//     const res = await api.get("/crop/history", { params: { page, limit } });
//     return res.data.data;
//   } catch (e) {
//     return unwrapError(e);
//   }
// };

// // ---------------------------------------------------------------------------
// // Soil Moisture Prediction
// // ---------------------------------------------------------------------------
// export type SoilType = "Sandy" | "Loamy" | "Clay" | "Silty" | "Peaty" | "Chalky";

// export interface SoilMoistureInput {
//   soilType: SoilType;
//   temperature: number;
//   humidity: number;
//   rainfall: number;
// }

// export interface SoilMoistureResult {
//   id: string;
//   moistureLevel: number;
//   irrigationSuggestion: string;
//   inputs: SoilMoistureInput;
//   createdAt: string;
// }

// export const predictSoilMoisture = async (data: SoilMoistureInput): Promise<SoilMoistureResult> => {
//   try {
//     const res = await api.post<ApiEnvelope<{ prediction: SoilMoistureResult }>>("/soil/predict", data);
//     return res.data.data.prediction;
//   } catch (e) {
//     return unwrapError(e);
//   }
// };

// export const getSoilHistory = async (page = 1, limit = 10) => {
//   try {
//     const res = await api.get("/soil/history", { params: { page, limit } });
//     return res.data.data;
//   } catch (e) {
//     return unwrapError(e);
//   }
// };

// // ---------------------------------------------------------------------------
// // Plant Disease Detection
// // ---------------------------------------------------------------------------
// export interface DiseasePredictionResult {
//   id: string;
//   cropType: string;
//   imageUrl: string;
//   diseaseName: string;
//   probability: number;
//   remedy: string;
//   createdAt: string;
// }

// export const predictDisease = async (image: File, cropType: string): Promise<DiseasePredictionResult> => {
//   try {
//     const formData = new FormData();
//     formData.append("image", image);
//     formData.append("cropType", cropType);

//     const res = await api.post<ApiEnvelope<{ prediction: DiseasePredictionResult }>>(
//       "/disease/predict",
//       formData,
//       { headers: { "Content-Type": "multipart/form-data" } }
//     );
//     return res.data.data.prediction;
//   } catch (e) {
//     return unwrapError(e);
//   }
// };

// export const getDiseaseHistory = async (page = 1, limit = 10) => {
//   try {
//     const res = await api.get("/disease/history", { params: { page, limit } });
//     return res.data.data;
//   } catch (e) {
//     return unwrapError(e);
//   }
// };

// // ---------------------------------------------------------------------------
// // Weather
// // ---------------------------------------------------------------------------
// export interface WeatherData {
//   city: string;
//   country: string;
//   temperature: number;
//   feelsLike: number;
//   humidity: number;
//   pressure: number;
//   description: string;
//   main: string;
//   windSpeed: number;
//   windDirection: number;
//   visibility: number;
//   cloudiness: number;
//   sunrise: number;
//   sunset: number;
// }

// export const getWeather = async (city: string): Promise<WeatherData> => {
//   try {
//     const res = await api.get<ApiEnvelope<WeatherData>>("/weather", { params: { city } });
//     return res.data.data;
//   } catch (e) {
//     return unwrapError(e);
//   }
// };

// export default api;




import axios, { AxiosError } from "axios";

// ---------------------------------------------------------------------------
// Base client
// ---------------------------------------------------------------------------
// Points at the Node/Express backend (backend/src), NOT the Python ML service
// directly. The backend proxies crop/soil predictions to the ML service and
// persists history in MongoDB.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const TOKEN_KEY = "agrismart_token";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT to every request if we have one
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize backend error shape { success: false, message } into a plain Error
const unwrapError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const axiosErr = error as AxiosError<{ message?: string; errors?: { field: string; message: string }[] }>;
    const message =
      axiosErr.response?.data?.message ||
      axiosErr.response?.data?.errors?.map((e) => e.message).join(", ") ||
      axiosErr.message;
    throw new Error(message);
  }
  throw error instanceof Error ? error : new Error("Unknown error");
};

// Generic envelope the backend wraps every response in
interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data: T;
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  createdAt?: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: "admin" | "user";
}

export interface LoginInput {
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterInput): Promise<{ token: string; user: AuthUser }> => {
  try {
    const res = await api.post<ApiEnvelope<{ token: string; user: AuthUser }>>("/auth/register", data);
    return res.data.data;
  } catch (e) {
    return unwrapError(e);
  }
};

export const loginUser = async (data: LoginInput): Promise<{ token: string; user: AuthUser }> => {
  try {
    const res = await api.post<ApiEnvelope<{ token: string; user: AuthUser }>>("/auth/login", data);
    return res.data.data;
  } catch (e) {
    return unwrapError(e);
  }
};

export const getCurrentUser = async (): Promise<AuthUser> => {
  try {
    const res = await api.get<ApiEnvelope<AuthUser>>("/auth/me");
    return res.data.data;
  } catch (e) {
    return unwrapError(e);
  }
};

// ---------------------------------------------------------------------------
// Crop Prediction
// ---------------------------------------------------------------------------
export interface CropPredictionInput {
  N: number;
  P: number;
  K: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
}

export interface CropPredictionResult {
  id: string;
  predictedCrop: string;
  confidence: number;
  inputs: CropPredictionInput;
  createdAt: string;
}

export const predictCrop = async (data: CropPredictionInput): Promise<CropPredictionResult> => {
  try {
    const res = await api.post<ApiEnvelope<{ prediction: CropPredictionResult }>>("/crop/predict", data);
    return res.data.data.prediction;
  } catch (e) {
    return unwrapError(e);
  }
};

export const getCropHistory = async (page = 1, limit = 10) => {
  try {
    const res = await api.get("/crop/history", { params: { page, limit } });
    return res.data.data;
  } catch (e) {
    return unwrapError(e);
  }
};

// ---------------------------------------------------------------------------
// Soil Moisture Prediction
// ---------------------------------------------------------------------------
export type SoilType = "Sandy" | "Loamy" | "Clay" | "Silty" | "Peaty" | "Chalky";

export interface SoilMoistureInput {
  soilType: SoilType;
  temperature: number;
  humidity: number;
  rainfall: number;
}

export interface SoilMoistureResult {
  id: string;
  moistureLevel: number;
  irrigationSuggestion: string;
  inputs: SoilMoistureInput;
  createdAt: string;
}

export const predictSoilMoisture = async (data: SoilMoistureInput): Promise<SoilMoistureResult> => {
  try {
    const res = await api.post<ApiEnvelope<{ prediction: SoilMoistureResult }>>("/soil/predict", data);
    return res.data.data.prediction;
  } catch (e) {
    return unwrapError(e);
  }
};

export const getSoilHistory = async (page = 1, limit = 10) => {
  try {
    const res = await api.get("/soil/history", { params: { page, limit } });
    return res.data.data;
  } catch (e) {
    return unwrapError(e);
  }
};

// ---------------------------------------------------------------------------
// Plant Disease Detection
// ---------------------------------------------------------------------------
export interface DiseasePredictionResult {
  id: string;
  cropType: string;
  imageUrl: string;
  diseaseName: string;
  probability: number;
  remedy: string;
  createdAt: string;
}

export const predictDisease = async (image: File, cropType: string): Promise<DiseasePredictionResult> => {
  try {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("cropType", cropType);

    const res = await api.post<ApiEnvelope<{ prediction: DiseasePredictionResult }>>(
      "/disease/predict",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res.data.data.prediction;
  } catch (e) {
    return unwrapError(e);
  }
};

export const getDiseaseHistory = async (page = 1, limit = 10) => {
  try {
    const res = await api.get("/disease/history", { params: { page, limit } });
    return res.data.data;
  } catch (e) {
    return unwrapError(e);
  }
};

// ---------------------------------------------------------------------------
// Weather
// ---------------------------------------------------------------------------
export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  description: string;
  main: string;
  windSpeed: number;
  windDirection: number;
  visibility: number;
  cloudiness: number;
  sunrise: number;
  sunset: number;
}

export const getWeather = async (city: string): Promise<WeatherData> => {
  try {
    const res = await api.get<ApiEnvelope<WeatherData>>("/weather", { params: { city } });
    return res.data.data;
  } catch (e) {
    return unwrapError(e);
  }
};

// ---------------------------------------------------------------------------
// Chatbot
// ---------------------------------------------------------------------------
export interface ChatHistoryItem {
  role: "user" | "assistant";
  text: string;
}

export const sendChatMessage = async (message: string, history: ChatHistoryItem[]): Promise<string> => {
  try {
    const res = await api.post<ApiEnvelope<{ reply: string }>>("/chat/message", { message, history });
    return res.data.data.reply;
  } catch (e) {
    return unwrapError(e);
  }
};

export default api;