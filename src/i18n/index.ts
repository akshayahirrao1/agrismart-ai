import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navbar
      nav: {
        home: "Home",
        cropPrediction: "Crop Prediction",
        soilMoisture: "Soil Moisture",
        diseaseDetection: "Disease Detection",
        weather: "Weather",
        login: "Login",
        logout: "Logout",
        welcome: "Welcome"
      },
      // Home Page
      home: {
        badge: "AI-Powered Agriculture Platform",
        title1: "Smart Farming,",
        title2: "Brighter Future",
        subtitle: "Harness the power of artificial intelligence to make data-driven decisions for crop selection, soil management, and disease prevention.",
        getStarted: "Get Started",
        checkWeather: "Check Weather",
        stats: {
          accuracy: "Prediction Accuracy",
          farmers: "Farmers Helped",
          crops: "Crop Varieties",
          support: "Support Available"
        },
        features: {
          title: "Powerful Features for Modern Farming",
          subtitle: "Our AI-driven tools help you make informed decisions at every step of the farming process."
        },
        cropRecommendation: "Crop Recommendation",
        cropDesc: "AI-powered predictions to help you choose the optimal crop based on soil and weather conditions.",
        soilMoisture: "Soil Moisture Analysis",
        soilDesc: "Monitor and predict soil moisture levels to optimize irrigation and water usage.",
        diseaseDetection: "Disease Detection",
        diseaseDesc: "Upload plant images to instantly detect diseases and get treatment recommendations.",
        weatherForecast: "Weather Forecast",
        weatherDesc: "Real-time weather updates and forecasts to plan your farming activities effectively.",
        whyChoose: "Why Choose AgriSmart?",
        increaseYield: "Increase Crop Yield",
        increaseYieldDesc: "Make data-driven decisions that maximize your harvest potential.",
        reduceRisks: "Reduce Risks",
        reduceRisksDesc: "Early disease detection and weather alerts protect your investment.",
        optimizeResources: "Optimize Resources",
        optimizeResourcesDesc: "Smart irrigation suggestions help conserve water and reduce costs.",
        ctaTitle: "Ready to Transform Your Farm?",
        ctaSubtitle: "Join thousands of farmers who are already using AgriSmart to improve their yields and make smarter agricultural decisions.",
        startPredicting: "Start Predicting Now"
      },
      // Auth Page
      auth: {
        loginTitle: "Welcome Back, Farmer!",
        loginSubtitle: "Sign in to access your smart farming dashboard",
        signupTitle: "Join AgriSmart",
        signupSubtitle: "Create an account to start your smart farming journey",
        name: "Full Name",
        namePlaceholder: "Enter your name",
        email: "Email Address",
        emailPlaceholder: "farmer@example.com",
        phone: "Phone Number",
        phonePlaceholder: "Enter your phone number",
        password: "Password",
        passwordPlaceholder: "Enter your password",
        farmName: "Farm Name (Optional)",
        farmNamePlaceholder: "My Farm",
        location: "Location",
        locationPlaceholder: "Village, District",
        loginBtn: "Sign In",
        signupBtn: "Create Account",
        noAccount: "Don't have an account?",
        hasAccount: "Already have an account?",
        signupLink: "Sign Up",
        loginLink: "Sign In",
        loginSuccess: "Login Successful!",
        loginSuccessMsg: "Welcome back to AgriSmart",
        signupSuccess: "Account Created!",
        signupSuccessMsg: "Welcome to AgriSmart family"
      },
      // Crop Prediction
      crop: {
        title: "Crop Recommendation",
        subtitle: "Enter soil and environmental parameters to get AI-powered crop recommendations for your farm.",
        nitrogen: "Nitrogen (N)",
        phosphorus: "Phosphorus (P)",
        potassium: "Potassium (K)",
        temperature: "Temperature (°C)",
        humidity: "Humidity (%)",
        ph: "pH Level",
        rainfall: "Rainfall (mm)",
        predict: "Predict Best Crop",
        predicting: "Analyzing...",
        result: "Recommended Crop",
        confidence: "Confidence Score",
        season: "Best Season",
        tips: "Growing Tips"
      },
      // Soil Moisture
      soil: {
        title: "Soil Moisture Prediction",
        subtitle: "Analyze soil conditions and get smart irrigation recommendations.",
        soilType: "Soil Type",
        selectSoilType: "Select soil type",
        clay: "Clay",
        sandy: "Sandy",
        loamy: "Loamy",
        silt: "Silt",
        peat: "Peat",
        temperature: "Temperature (°C)",
        humidity: "Humidity (%)",
        rainfall: "Recent Rainfall (mm)",
        previousMoisture: "Previous Moisture Level (%)",
        analyze: "Analyze Soil Moisture",
        analyzing: "Analyzing...",
        result: "Moisture Level",
        percentage: "Moisture Percentage",
        irrigation: "Irrigation Needed",
        yes: "Yes",
        no: "No",
        recommendation: "Recommendation"
      },
      // Disease Detection
      disease: {
        title: "Plant Disease Detection",
        subtitle: "Upload a plant leaf image to detect diseases and get treatment recommendations.",
        uploadImage: "Upload Plant Image",
        dragDrop: "Drag and drop an image here, or click to select",
        supportedFormats: "Supports: JPG, PNG, WEBP (Max 10MB)",
        cropType: "Crop Type",
        selectCrop: "Select crop type",
        detect: "Detect Disease",
        detecting: "Analyzing Image...",
        result: "Disease Detected",
        probability: "Confidence",
        treatment: "Treatment",
        prevention: "Prevention Tips"
      },
      // Weather
      weather: {
        title: "Weather Forecast",
        subtitle: "Get real-time weather information and forecasts for your farming location.",
        enterCity: "Enter city name",
        search: "Search",
        searching: "Searching...",
        temperature: "Temperature",
        humidity: "Humidity",
        wind: "Wind Speed",
        rainfall: "Rain Chance",
        forecast: "5-Day Forecast",
        farmingTips: "Farming Recommendations"
      },
      // Chatbot
      chat: {
        title: "Farming Assistant",
        placeholder: "Ask about crops, weather, diseases...",
        send: "Send",
        welcome: "Hello! I'm your farming assistant. How can I help you today?",
        greeting: "Hi! I can help you with crop recommendations, soil tips, disease identification, and weather information. What would you like to know?"
      },
      // Common
      common: {
        loading: "Loading...",
        error: "Something went wrong",
        success: "Success",
        submit: "Submit",
        cancel: "Cancel",
        back: "Back",
        next: "Next",
        save: "Save",
        close: "Close"
      },
      // Footer
      footer: {
        tagline: "Empowering farmers with AI-driven insights for smarter, sustainable agriculture.",
        features: "Features",
        support: "Support",
        helpCenter: "Help Center",
        contact: "Contact Us",
        faq: "FAQ",
        legal: "Legal",
        privacy: "Privacy Policy",
        terms: "Terms of Service",
        rights: "All rights reserved."
      }
    }
  },
  hi: {
    translation: {
      // Navbar
      nav: {
        home: "होम",
        cropPrediction: "फसल सुझाव",
        soilMoisture: "मिट्टी की नमी",
        diseaseDetection: "रोग पहचान",
        weather: "मौसम",
        login: "लॉगिन",
        logout: "लॉग आउट",
        welcome: "स्वागत है"
      },
      // Home Page
      home: {
        badge: "AI-संचालित कृषि मंच",
        title1: "स्मार्ट खेती,",
        title2: "उज्जवल भविष्य",
        subtitle: "फसल चयन, मिट्टी प्रबंधन और रोग रोकथाम के लिए डेटा-संचालित निर्णय लेने के लिए कृत्रिम बुद्धिमत्ता की शक्ति का उपयोग करें।",
        getStarted: "शुरू करें",
        checkWeather: "मौसम देखें",
        stats: {
          accuracy: "भविष्यवाणी सटीकता",
          farmers: "किसानों की मदद",
          crops: "फसल किस्में",
          support: "सहायता उपलब्ध"
        },
        features: {
          title: "आधुनिक खेती के लिए शक्तिशाली सुविधाएं",
          subtitle: "हमारे AI-संचालित उपकरण खेती प्रक्रिया के हर चरण में सूचित निर्णय लेने में आपकी मदद करते हैं।"
        },
        cropRecommendation: "फसल सुझाव",
        cropDesc: "मिट्टी और मौसम की स्थिति के आधार पर सर्वोत्तम फसल चुनने में AI-संचालित भविष्यवाणियां।",
        soilMoisture: "मिट्टी नमी विश्लेषण",
        soilDesc: "सिंचाई और पानी के उपयोग को अनुकूलित करने के लिए मिट्टी की नमी के स्तर की निगरानी और भविष्यवाणी करें।",
        diseaseDetection: "रोग पहचान",
        diseaseDesc: "रोगों का तुरंत पता लगाने और उपचार सुझाव प्राप्त करने के लिए पौधे की छवियां अपलोड करें।",
        weatherForecast: "मौसम पूर्वानुमान",
        weatherDesc: "अपनी खेती गतिविधियों की प्रभावी योजना के लिए वास्तविक समय मौसम अपडेट और पूर्वानुमान।",
        whyChoose: "AgriSmart क्यों चुनें?",
        increaseYield: "फसल उपज बढ़ाएं",
        increaseYieldDesc: "डेटा-संचालित निर्णय लें जो आपकी फसल क्षमता को अधिकतम करें।",
        reduceRisks: "जोखिम कम करें",
        reduceRisksDesc: "जल्दी रोग का पता लगाना और मौसम अलर्ट आपके निवेश की रक्षा करते हैं।",
        optimizeResources: "संसाधन अनुकूलित करें",
        optimizeResourcesDesc: "स्मार्ट सिंचाई सुझाव पानी बचाने और लागत कम करने में मदद करते हैं।",
        ctaTitle: "अपने खेत को बदलने के लिए तैयार?",
        ctaSubtitle: "हजारों किसानों से जुड़ें जो पहले से ही अपनी उपज बढ़ाने और बेहतर कृषि निर्णय लेने के लिए AgriSmart का उपयोग कर रहे हैं।",
        startPredicting: "अभी भविष्यवाणी शुरू करें"
      },
      // Auth Page
      auth: {
        loginTitle: "वापसी पर स्वागत है, किसान!",
        loginSubtitle: "अपने स्मार्ट खेती डैशबोर्ड तक पहुंचने के लिए साइन इन करें",
        signupTitle: "AgriSmart में शामिल हों",
        signupSubtitle: "अपनी स्मार्ट खेती यात्रा शुरू करने के लिए खाता बनाएं",
        name: "पूरा नाम",
        namePlaceholder: "अपना नाम दर्ज करें",
        email: "ईमेल पता",
        emailPlaceholder: "farmer@example.com",
        phone: "फोन नंबर",
        phonePlaceholder: "अपना फोन नंबर दर्ज करें",
        password: "पासवर्ड",
        passwordPlaceholder: "अपना पासवर्ड दर्ज करें",
        farmName: "खेत का नाम (वैकल्पिक)",
        farmNamePlaceholder: "मेरा खेत",
        location: "स्थान",
        locationPlaceholder: "गांव, जिला",
        loginBtn: "साइन इन करें",
        signupBtn: "खाता बनाएं",
        noAccount: "खाता नहीं है?",
        hasAccount: "पहले से खाता है?",
        signupLink: "साइन अप करें",
        loginLink: "साइन इन करें",
        loginSuccess: "लॉगिन सफल!",
        loginSuccessMsg: "AgriSmart में वापसी पर स्वागत है",
        signupSuccess: "खाता बनाया गया!",
        signupSuccessMsg: "AgriSmart परिवार में आपका स्वागत है"
      },
      // Crop Prediction
      crop: {
        title: "फसल सुझाव",
        subtitle: "अपने खेत के लिए AI-संचालित फसल सुझाव प्राप्त करने के लिए मिट्टी और पर्यावरण मापदंड दर्ज करें।",
        nitrogen: "नाइट्रोजन (N)",
        phosphorus: "फॉस्फोरस (P)",
        potassium: "पोटेशियम (K)",
        temperature: "तापमान (°C)",
        humidity: "आर्द्रता (%)",
        ph: "pH स्तर",
        rainfall: "वर्षा (मिमी)",
        predict: "सर्वोत्तम फसल का सुझाव लें",
        predicting: "विश्लेषण हो रहा है...",
        result: "अनुशंसित फसल",
        confidence: "विश्वास स्कोर",
        season: "सर्वोत्तम मौसम",
        tips: "उगाने के सुझाव"
      },
      // Soil Moisture
      soil: {
        title: "मिट्टी नमी भविष्यवाणी",
        subtitle: "मिट्टी की स्थिति का विश्लेषण करें और स्मार्ट सिंचाई सुझाव प्राप्त करें।",
        soilType: "मिट्टी का प्रकार",
        selectSoilType: "मिट्टी का प्रकार चुनें",
        clay: "चिकनी मिट्टी",
        sandy: "रेतीली मिट्टी",
        loamy: "दोमट मिट्टी",
        silt: "गाद मिट्टी",
        peat: "पीट मिट्टी",
        temperature: "तापमान (°C)",
        humidity: "आर्द्रता (%)",
        rainfall: "हाल की वर्षा (मिमी)",
        previousMoisture: "पिछला नमी स्तर (%)",
        analyze: "मिट्टी नमी विश्लेषण करें",
        analyzing: "विश्लेषण हो रहा है...",
        result: "नमी स्तर",
        percentage: "नमी प्रतिशत",
        irrigation: "सिंचाई आवश्यक",
        yes: "हाँ",
        no: "नहीं",
        recommendation: "सुझाव"
      },
      // Disease Detection
      disease: {
        title: "पौधा रोग पहचान",
        subtitle: "रोगों का पता लगाने और उपचार सुझाव प्राप्त करने के लिए पौधे की पत्ती की छवि अपलोड करें।",
        uploadImage: "पौधे की छवि अपलोड करें",
        dragDrop: "यहां छवि खींचें और छोड़ें, या चयन करने के लिए क्लिक करें",
        supportedFormats: "समर्थित: JPG, PNG, WEBP (अधिकतम 10MB)",
        cropType: "फसल का प्रकार",
        selectCrop: "फसल का प्रकार चुनें",
        detect: "रोग पहचानें",
        detecting: "छवि विश्लेषण हो रहा है...",
        result: "पहचाना गया रोग",
        probability: "विश्वास",
        treatment: "उपचार",
        prevention: "रोकथाम सुझाव"
      },
      // Weather
      weather: {
        title: "मौसम पूर्वानुमान",
        subtitle: "अपने खेती स्थान के लिए वास्तविक समय मौसम जानकारी और पूर्वानुमान प्राप्त करें।",
        enterCity: "शहर का नाम दर्ज करें",
        search: "खोजें",
        searching: "खोज रहा है...",
        temperature: "तापमान",
        humidity: "आर्द्रता",
        wind: "हवा की गति",
        rainfall: "वर्षा संभावना",
        forecast: "5-दिन का पूर्वानुमान",
        farmingTips: "खेती सुझाव"
      },
      // Chatbot
      chat: {
        title: "खेती सहायक",
        placeholder: "फसलों, मौसम, रोगों के बारे में पूछें...",
        send: "भेजें",
        welcome: "नमस्ते! मैं आपका खेती सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?",
        greeting: "नमस्ते! मैं फसल सुझाव, मिट्टी टिप्स, रोग पहचान और मौसम जानकारी में आपकी मदद कर सकता हूं। आप क्या जानना चाहते हैं?"
      },
      // Common
      common: {
        loading: "लोड हो रहा है...",
        error: "कुछ गलत हो गया",
        success: "सफल",
        submit: "जमा करें",
        cancel: "रद्द करें",
        back: "वापस",
        next: "आगे",
        save: "सहेजें",
        close: "बंद करें"
      },
      // Footer
      footer: {
        tagline: "स्मार्ट, टिकाऊ कृषि के लिए AI-संचालित अंतर्दृष्टि के साथ किसानों को सशक्त बनाना।",
        features: "सुविधाएं",
        support: "सहायता",
        helpCenter: "सहायता केंद्र",
        contact: "संपर्क करें",
        faq: "सामान्य प्रश्न",
        legal: "कानूनी",
        privacy: "गोपनीयता नीति",
        terms: "सेवा की शर्तें",
        rights: "सर्वाधिकार सुरक्षित।"
      }
    }
  }
};

// Guarded rather than a direct localStorage.getItem() call — some
// environments (certain test runners, SSR, privacy modes) don't expose a
// working localStorage, and this shouldn't crash i18n init if so.
const getStoredLanguage = (): string => {
  try {
    return localStorage.getItem('language') || 'en';
  } catch {
    return 'en';
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getStoredLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;