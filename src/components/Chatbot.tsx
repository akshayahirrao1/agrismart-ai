// import { useState, useRef, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useTranslation } from "react-i18next";
// import { MessageCircle, X, Send, Bot, User, Sparkles } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// interface Message {
//   id: string;
//   text: string;
//   isBot: boolean;
//   timestamp: Date;
// }

// // Simple bot responses based on keywords
// const getBotResponse = (input: string, lang: string): string => {
//   const lowerInput = input.toLowerCase();
  
//   const responses: Record<string, { en: string; hi: string }> = {
//     crop: {
//       en: "For crop recommendations, I suggest checking the Crop Prediction page. Enter your soil parameters like N, P, K values, temperature, humidity, pH, and rainfall to get AI-powered suggestions!",
//       hi: "फसल सुझाव के लिए, मैं फसल भविष्यवाणी पेज देखने का सुझाव देता हूं। AI-संचालित सुझाव प्राप्त करने के लिए अपने मिट्टी मापदंड जैसे N, P, K मान, तापमान, आर्द्रता, pH और वर्षा दर्ज करें!"
//     },
//     weather: {
//       en: "You can check the Weather page for real-time forecasts. Enter your city name to get temperature, humidity, wind speed, and 5-day forecasts for better farming planning!",
//       hi: "आप वास्तविक समय पूर्वानुमान के लिए मौसम पेज देख सकते हैं। बेहतर खेती योजना के लिए तापमान, आर्द्रता, हवा की गति और 5-दिन का पूर्वानुमान प्राप्त करने के लिए अपना शहर का नाम दर्ज करें!"
//     },
//     disease: {
//       en: "For plant disease detection, go to the Disease Detection page. Upload a clear image of the affected plant leaf, and our AI will identify the disease and provide treatment suggestions!",
//       hi: "पौधों के रोग की पहचान के लिए, रोग पहचान पेज पर जाएं। प्रभावित पौधे की पत्ती की एक स्पष्ट छवि अपलोड करें, और हमारा AI रोग की पहचान करेगा और उपचार सुझाव प्रदान करेगा!"
//     },
//     soil: {
//       en: "For soil moisture analysis, visit the Soil Moisture page. Enter your soil type, temperature, humidity, and rainfall data to get moisture predictions and irrigation recommendations!",
//       hi: "मिट्टी नमी विश्लेषण के लिए, मिट्टी नमी पेज पर जाएं। नमी भविष्यवाणी और सिंचाई सुझाव प्राप्त करने के लिए अपना मिट्टी प्रकार, तापमान, आर्द्रता और वर्षा डेटा दर्ज करें!"
//     },
//     irrigation: {
//       en: "Smart irrigation is crucial! Based on soil moisture levels, we recommend: Low moisture - irrigate immediately, Medium - monitor closely, High - wait before irrigating. Check the Soil Moisture page for personalized advice!",
//       hi: "स्मार्ट सिंचाई महत्वपूर्ण है! मिट्टी की नमी के स्तर के आधार पर, हम सुझाव देते हैं: कम नमी - तुरंत सिंचाई करें, मध्यम - निकट से निगरानी करें, उच्च - सिंचाई से पहले प्रतीक्षा करें। व्यक्तिगत सलाह के लिए मिट्टी नमी पेज देखें!"
//     },
//     hello: {
//       en: "Hello! 👋 I'm your farming assistant. I can help you with crop recommendations, soil analysis, disease detection, and weather information. What would you like to know?",
//       hi: "नमस्ते! 👋 मैं आपका खेती सहायक हूं। मैं फसल सुझाव, मिट्टी विश्लेषण, रोग पहचान और मौसम जानकारी में आपकी मदद कर सकता हूं। आप क्या जानना चाहते हैं?"
//     },
//     namaste: {
//       en: "Namaste! 🙏 I'm your farming assistant. How can I help you today with your agricultural needs?",
//       hi: "नमस्ते! 🙏 मैं आपका खेती सहायक हूं। आज मैं आपकी कृषि जरूरतों में कैसे मदद कर सकता हूं?"
//     },
//     help: {
//       en: "I can help you with:\n• Crop recommendations based on soil & weather\n• Soil moisture analysis\n• Plant disease detection\n• Weather forecasts\n\nJust ask me anything about farming!",
//       hi: "मैं इनमें आपकी मदद कर सकता हूं:\n• मिट्टी और मौसम के आधार पर फसल सुझाव\n• मिट्टी नमी विश्लेषण\n• पौधों के रोग की पहचान\n• मौसम पूर्वानुमान\n\nखेती के बारे में कुछ भी पूछें!"
//     },
//     fertilizer: {
//       en: "For fertilizer recommendations, first get your soil tested for N, P, K levels. Based on the crop you want to grow and soil conditions, I can suggest the right fertilizer mix. Visit the Crop Prediction page for detailed analysis!",
//       hi: "उर्वरक सुझाव के लिए, पहले अपनी मिट्टी का N, P, K स्तर के लिए परीक्षण करवाएं। आप जो फसल उगाना चाहते हैं और मिट्टी की स्थिति के आधार पर, मैं सही उर्वरक मिश्रण सुझा सकता हूं। विस्तृत विश्लेषण के लिए फसल भविष्यवाणी पेज पर जाएं!"
//     },
//     pest: {
//       en: "For pest control, early detection is key! Upload images of affected plants on our Disease Detection page. We can identify common pests and suggest organic and chemical treatment options.",
//       hi: "कीट नियंत्रण के लिए, जल्दी पहचान महत्वपूर्ण है! हमारे रोग पहचान पेज पर प्रभावित पौधों की छवियां अपलोड करें। हम सामान्य कीटों की पहचान कर सकते हैं और जैविक और रासायनिक उपचार विकल्प सुझा सकते हैं।"
//     }
//   };

//   // Check for keywords
//   for (const [keyword, response] of Object.entries(responses)) {
//     if (lowerInput.includes(keyword)) {
//       return response[lang as 'en' | 'hi'] || response.en;
//     }
//   }

//   // Default response
//   const defaultResponses = {
//     en: "I'm not sure about that, but I can help you with crop recommendations, soil analysis, disease detection, and weather information. Try asking about any of these topics!",
//     hi: "मुझे इसके बारे में पक्का नहीं है, लेकिन मैं फसल सुझाव, मिट्टी विश्लेषण, रोग पहचान और मौसम जानकारी में आपकी मदद कर सकता हूं। इनमें से किसी भी विषय के बारे में पूछने का प्रयास करें!"
//   };

//   return defaultResponses[lang as 'en' | 'hi'] || defaultResponses.en;
// };

// export default function Chatbot() {
//   const { t, i18n } = useTranslation();
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   // Initialize with welcome message
//   useEffect(() => {
//     if (messages.length === 0) {
//       setMessages([
//         {
//           id: crypto.randomUUID(),
//           text: t("chat.welcome"),
//           isBot: true,
//           timestamp: new Date(),
//         },
//       ]);
//     }
//   }, [t]);

//   // Scroll to bottom on new messages
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleSend = async () => {
//     if (!input.trim()) return;

//     const userMessage: Message = {
//       id: crypto.randomUUID(),
//       text: input,
//       isBot: false,
//       timestamp: new Date(),
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");
//     setIsTyping(true);

//     // Simulate typing delay
//     await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

//     const botResponse = getBotResponse(input, i18n.language);
//     const botMessage: Message = {
//       id: crypto.randomUUID(),
//       text: botResponse,
//       isBot: true,
//       timestamp: new Date(),
//     };

//     setIsTyping(false);
//     setMessages((prev) => [...prev, botMessage]);
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   return (
//     <>
//       {/* Chat Button */}
//       <motion.button
//         initial={{ scale: 0, rotate: -180 }}
//         animate={{ scale: 1, rotate: 0 }}
//         transition={{ delay: 1, type: "spring", stiffness: 200 }}
//         whileHover={{ scale: 1.1 }}
//         whileTap={{ scale: 0.9 }}
//         onClick={() => setIsOpen(!isOpen)}
//         className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full gradient-leaf shadow-glow flex items-center justify-center text-primary-foreground group"
//       >
//         <motion.div
//           animate={{ rotate: isOpen ? 180 : 0 }}
//           transition={{ duration: 0.3 }}
//         >
//           {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
//         </motion.div>
//         {!isOpen && (
//           <motion.div
//             animate={{ scale: [1, 1.2, 1] }}
//             transition={{ duration: 2, repeat: Infinity }}
//             className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent flex items-center justify-center"
//           >
//             <Sparkles className="w-2.5 h-2.5 text-accent-foreground" />
//           </motion.div>
//         )}
//       </motion.button>

//       {/* Chat Window */}
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0, y: 20, scale: 0.9 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             exit={{ opacity: 0, y: 20, scale: 0.9 }}
//             transition={{ type: "spring", stiffness: 300, damping: 25 }}
//             className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] glass-card overflow-hidden shadow-float"
//           >
//             {/* Header */}
//             <div className="gradient-leaf p-4 flex items-center gap-3">
//               <motion.div
//                 animate={{ rotate: [0, 10, -10, 0] }}
//                 transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
//                 className="w-12 h-12 rounded-xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center border border-primary-foreground/10"
//               >
//                 <Bot className="w-6 h-6 text-primary-foreground" />
//               </motion.div>
//               <div className="flex-1">
//                 <h3 className="font-display font-semibold text-primary-foreground">
//                   {t("chat.title")}
//                 </h3>
//                 <div className="flex items-center gap-2">
//                   <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
//                   <p className="text-xs text-primary-foreground/80">Online • Ready to help</p>
//                 </div>
//               </div>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={() => setIsOpen(false)}
//                 className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 rounded-full"
//               >
//                 <X className="w-5 h-5" />
//               </Button>
//             </div>

//             {/* Messages */}
//             <div className="h-80 overflow-y-auto p-4 space-y-4 bg-background/50">
//               {messages.map((message, index) => (
//                 <motion.div
//                   key={message.id}
//                   initial={{ opacity: 0, y: 10, scale: 0.95 }}
//                   animate={{ opacity: 1, y: 0, scale: 1 }}
//                   transition={{ delay: index * 0.05 }}
//                   className={`flex gap-2 ${message.isBot ? "" : "flex-row-reverse"}`}
//                 >
//                   <motion.div
//                     whileHover={{ scale: 1.1 }}
//                     className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
//                       message.isBot
//                         ? "bg-primary/10 text-primary"
//                         : "bg-accent/10 text-accent"
//                     }`}
//                   >
//                     {message.isBot ? (
//                       <Bot className="w-4 h-4" />
//                     ) : (
//                       <User className="w-4 h-4" />
//                     )}
//                   </motion.div>
//                   <div
//                     className={`max-w-[75%] p-3 rounded-2xl text-sm whitespace-pre-line shadow-soft ${
//                       message.isBot
//                         ? "bg-card text-foreground rounded-tl-sm border border-border"
//                         : "bg-primary text-primary-foreground rounded-tr-sm"
//                     }`}
//                   >
//                     {message.text}
//                   </div>
//                 </motion.div>
//               ))}
              
//               {isTyping && (
//                 <motion.div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   className="flex gap-2"
//                 >
//                   <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
//                     <Bot className="w-4 h-4 text-primary" />
//                   </div>
//                   <div className="bg-card p-4 rounded-2xl rounded-tl-sm border border-border shadow-soft">
//                     <div className="flex gap-1.5">
//                       {[0, 1, 2].map((i) => (
//                         <motion.span
//                           key={i}
//                           animate={{ y: [0, -5, 0] }}
//                           transition={{
//                             duration: 0.6,
//                             repeat: Infinity,
//                             delay: i * 0.15,
//                           }}
//                           className="w-2 h-2 bg-primary/60 rounded-full"
//                         />
//                       ))}
//                     </div>
//                   </div>
//                 </motion.div>
//               )}
              
//               <div ref={messagesEndRef} />
//             </div>

//             {/* Input */}
//             <div className="p-4 border-t border-border bg-card/80 backdrop-blur-sm">
//               <div className="flex gap-2">
//                 <Input
//                   value={input}
//                   onChange={(e) => setInput(e.target.value)}
//                   onKeyPress={handleKeyPress}
//                   placeholder={t("chat.placeholder")}
//                   className="flex-1 rounded-full bg-background/80 border-border/50 focus:border-primary"
//                 />
//                 <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                   <Button
//                     onClick={handleSend}
//                     disabled={!input.trim() || isTyping}
//                     size="icon"
//                     variant="hero"
//                     className="rounded-full shadow-soft"
//                   >
//                     <Send className="w-4 h-4" />
//                   </Button>
//                 </motion.div>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }



import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { MessageCircle, X, Send, Bot, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendChatMessage, ChatHistoryItem } from "@/services/api";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export default function Chatbot() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: crypto.randomUUID(),
          text: t("chat.welcome"),
          isBot: true,
          timestamp: new Date(),
        },
      ]);
    }
  }, [t]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input;
    const userMessage: Message = {
      id: crypto.randomUUID(),
      text: userText,
      isBot: false,
      timestamp: new Date(),
    };

    // Build history from current messages before adding the new one, capped
    // to keep the request small (the backend also caps it defensively)
    const history: ChatHistoryItem[] = messages.slice(-6).map((m) => ({
      role: m.isBot ? "assistant" : "user",
      text: m.text,
    }));

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const reply = await sendChatMessage(userText, history);
      const botMessage: Message = {
        id: crypto.randomUUID(),
        text: reply,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Sorry, I couldn't respond right now. Please try again.";
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        text: message,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full gradient-leaf shadow-glow flex items-center justify-center text-primary-foreground group"
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </motion.div>
        {!isOpen && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent flex items-center justify-center"
          >
            <Sparkles className="w-2.5 h-2.5 text-accent-foreground" />
          </motion.div>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] glass-card overflow-hidden shadow-float"
          >
            {/* Header */}
            <div className="gradient-leaf p-4 flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="w-12 h-12 rounded-xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center border border-primary-foreground/10"
              >
                <Bot className="w-6 h-6 text-primary-foreground" />
              </motion.div>
              <div className="flex-1">
                <h3 className="font-display font-semibold text-primary-foreground">
                  {t("chat.title")}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <p className="text-xs text-primary-foreground/80">Online • Ready to help</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-4 bg-background/50">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex gap-2 ${message.isBot ? "" : "flex-row-reverse"}`}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      message.isBot
                        ? "bg-primary/10 text-primary"
                        : "bg-accent/10 text-accent"
                    }`}
                  >
                    {message.isBot ? (
                      <Bot className="w-4 h-4" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </motion.div>
                  <div
                    className={`max-w-[75%] p-3 rounded-2xl text-sm whitespace-pre-line shadow-soft ${
                      message.isBot
                        ? "bg-card text-foreground rounded-tl-sm border border-border"
                        : "bg-primary text-primary-foreground rounded-tr-sm"
                    }`}
                  >
                    {message.text}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-card p-4 rounded-2xl rounded-tl-sm border border-border shadow-soft">
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          animate={{ y: [0, -5, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.15,
                          }}
                          className="w-2 h-2 bg-primary/60 rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border bg-card/80 backdrop-blur-sm">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t("chat.placeholder")}
                  className="flex-1 rounded-full bg-background/80 border-border/50 focus:border-primary"
                />
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    size="icon"
                    variant="hero"
                    className="rounded-full shadow-soft"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}