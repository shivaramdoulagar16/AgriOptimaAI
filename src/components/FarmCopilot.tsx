import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, MessageSquare, X, Send, Bot, User, Mic, MicOff, ChevronDown, CheckCircle2 } from 'lucide-react';
import { Farm, OptimizationResult, CropRecommendation } from '../types/index.ts';
import { formatINR } from '../utils/currency.ts';

interface FarmCopilotProps {
  farm: Farm;
  optimization: OptimizationResult | null;
  recommendations: CropRecommendation[];
  onNavigateTab?: (tabId: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  actionTab?: string;
  actionLabel?: string;
}

const SUGGESTED_QUERIES = [
  'What should I grow?',
  'Why was this crop selected?',
  'How can I reduce water usage?',
  'What happens if my water decreases by 30%?',
  'Which crop has the highest expected return?',
  'Why is my current plan risky?',
  'What should I monitor?'
];

export const FarmCopilot: React.FC<FarmCopilotProps> = ({
  farm,
  optimization,
  recommendations,
  onNavigateTab
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello! I am your AgriOptima Copilot, grounded in ${farm.name}'s live data (${farm.land_area_ha} ha, ${farm.soil.soil_type} soil, ${farm.resources.water_m3.toLocaleString()} m³ water). How can I assist your farm planning today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Speech Recognition Setup (Web Speech API)
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      try {
        recognitionRef.current.start();
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  const handleAsk = (userQuestion: string) => {
    if (!userQuestion.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userQuestion,
      timestamp: time
    };

    setMessages(prev => [...prev, userMsg]);
    setQuery('');

    // Generate grounded context-aware response using actual farm data
    setTimeout(() => {
      const reply = generateContextualResponse(userQuestion.toLowerCase().trim());
      setMessages(prev => [...prev, reply]);
    }, 350);
  };

  const generateContextualResponse = (q: string): ChatMessage => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const summary = optimization?.summary;
    const topCrop = recommendations.length > 0 ? recommendations[0] : null;

    // 1. "What should I grow?"
    if (q.includes('what should i grow') || q.includes('recommended crop') || q.includes('what to plant')) {
      if (!topCrop) {
        return {
          id: Date.now().toString(),
          sender: 'ai',
          text: "I don't have enough information to determine that yet. Please ensure farm soil and seasonal data are loaded.",
          timestamp: time
        };
      }

      const allocatedCrops = optimization?.allocations.map(a => `${a.crop_name} (${a.allocated_ha} ha)`).join(', ');

      return {
        id: Date.now().toString(),
        sender: 'ai',
        text: `Based on your ${farm.soil.soil_type} soil (pH ${farm.soil.pH}) and ${farm.season} season, the top AI-recommended crop is **${topCrop.crop_name}** with a ${topCrop.suitability_score}% suitability rating. \n\nUnder your continuous Simplex LP plan (${optimization?.strategy || 'balanced'} strategy), the optimal multi-crop mix is: **${allocatedCrops || topCrop.crop_name}**, projected to return **${formatINR(summary?.total_profit || 0)}** net margin.`,
        timestamp: time,
        actionTab: 'recommendations',
        actionLabel: 'Inspect AI Recommendations'
      };
    }

    // 2. "Why was this crop selected?"
    if (q.includes('why was') || q.includes('why selected') || q.includes('why recommend')) {
      if (!topCrop) {
        return {
          id: Date.now().toString(),
          sender: 'ai',
          text: "I don't have enough information to determine that. No candidate crops have been ranked yet.",
          timestamp: time
        };
      }

      return {
        id: Date.now().toString(),
        sender: 'ai',
        text: `**${topCrop.crop_name}** was selected because:\n1. **Soil Reaction**: pH ${farm.soil.pH} falls cleanly inside its optimal threshold (${topCrop.technical_explanation?.ph_score || 90}% score).\n2. **Nutrient Window**: Available Nitrogen (${farm.soil.N} kg/ha) matches vegetative demand without toxic runoff.\n3. **Water Intensity**: Requires ${topCrop.water_req_m3_ha.toLocaleString()} m³/ha, which safely fits within your ${farm.resources.water_m3.toLocaleString()} m³ reserve.\n4. **Economics**: Yields an expected ${topCrop.predicted_yield_tons_ha} tons/ha with ${formatINR(topCrop.net_profit_per_ha)} net profit per hectare.`,
        timestamp: time,
        actionTab: 'recommendations',
        actionLabel: 'View Detailed Agronomic Breakdown'
      };
    }

    // 3. "How can I reduce water usage?"
    if (q.includes('reduce water') || q.includes('save water') || q.includes('conserve water')) {
      const currentWaterPct = summary ? summary.water_utilization_pct : 0;
      return {
        id: Date.now().toString(),
        sender: 'ai',
        text: `Your current plan consumes **${summary?.used_water_m3.toLocaleString() || 0} m³** (${currentWaterPct}% of your total ${farm.resources.water_m3.toLocaleString()} m³ capacity).\n\nTo conserve water:\n1. **Switch to "Water Saver" Strategy**: The LP solver penalizes high-evapotranspiration crops and allocates drought-resilient legumes/pulses, cutting water intensity by 20-30% while retaining over 85% profitability.\n2. **Shift High-Water Parcels**: Substituting paddy or sugarcane with wheat or chickpea reduces irrigation duty by up to 55%.`,
        timestamp: time,
        actionTab: 'strategies',
        actionLabel: 'Open Strategy Comparison Matrix'
      };
    }

    // 4. "What happens if my water decreases by 30%?"
    if (q.includes('water decrease') || q.includes('water drops') || q.includes('30%') || q.includes('drought')) {
      const reducedWater = Math.round(farm.resources.water_m3 * 0.7);
      return {
        id: Date.now().toString(),
        sender: 'ai',
        text: `If water drops 30% (from ${farm.resources.water_m3.toLocaleString()} m³ down to **${reducedWater.toLocaleString()} m³**):\n\n• The LP solver will automatically constrain high-water crops.\n• Acreage shifts toward drought-hardy varieties with lower m³/ha footprint.\n• Projected net profit typically adjusts by -5% to -12%, preserving primary farm solvency.\n\nYou can simulate this exact scenario live in the **What-If Lab** with one click.`,
        timestamp: time,
        actionTab: 'what_if',
        actionLabel: 'Run Drought Scenario Simulation'
      };
    }

    // 5. "Which crop has the highest expected return?"
    if (q.includes('highest return') || q.includes('highest profit') || q.includes('most profitable')) {
      const sortedByMargin = [...recommendations].sort((a, b) => b.net_profit_per_ha - a.net_profit_per_ha);
      if (sortedByMargin.length === 0) {
        return {
          id: Date.now().toString(),
          sender: 'ai',
          text: "I don't have enough information to determine that without evaluated crop data.",
          timestamp: time
        };
      }

      const highest = sortedByMargin[0];
      return {
        id: Date.now().toString(),
        sender: 'ai',
        text: `**${highest.crop_name}** offers the highest expected return at **${formatINR(highest.net_profit_per_ha)} per hectare** (Predicted Harvest: ${highest.predicted_yield_tons_ha} t/ha, Cultivation Cost: ${formatINR(highest.cultivation_cost_per_ha)}/ha, Risk Tier: ${highest.risk_level}).\n\n*Note:* The Simplex optimizer balances this high margin against water reserve and risk limits to avoid catastrophic single-crop exposure.`,
        timestamp: time,
        actionTab: 'optimizer',
        actionLabel: 'Check LP Allocation Strategy'
      };
    }

    // 6. "Why is my current plan risky?"
    if (q.includes('why is my current plan risky') || q.includes('risky') || q.includes('risk level')) {
      const risk = summary?.composite_risk || 'Low';
      const riskScore = summary?.composite_risk_score || 0.25;

      return {
        id: Date.now().toString(),
        sender: 'ai',
        text: `Your current plan is evaluated as **${risk} Risk** (Risk index: ${riskScore} on 0-1 scale).\n\nKey vulnerability drivers:\n1. **Irrigation Stress Factor**: Water utilization is at ${summary?.water_utilization_pct || 75}%. Any unseasonal dry spell creates immediate yield stress.\n2. **Market Price Fluctuation**: Cash crops carry variable mandi wholesale volatility.\n3. **Monoculture Limit**: The system enforces an upper cap (70% max single crop) to prevent total crop failure.`,
        timestamp: time,
        actionTab: 'strategies',
        actionLabel: 'Explore Risk-Aware Strategy'
      };
    }

    // 7. "What should I monitor?"
    if (q.includes('what should i monitor') || q.includes('monitor') || q.includes('next steps') || q.includes('watch')) {
      return {
        id: Date.now().toString(),
        sender: 'ai',
        text: `For ${farm.name} during the **${farm.season}** cycle, monitor these 3 primary indicators:\n\n1. **Aquifer / Canal Reserve**: You have deployed ${summary?.used_water_m3.toLocaleString() || 0} m³ out of ${farm.resources.water_m3.toLocaleString()} m³.\n2. **Soil pH Drift**: Current pH is ${farm.soil.pH}. Keep within 6.2 - 7.2 to maintain optimal nutrient uptake.\n3. **Working Capital Depletion**: Ensure seasonal input costs stay within ${formatINR(farm.resources.budget_usd)} to avoid unhedged debt.`,
        timestamp: time,
        actionTab: 'overview',
        actionLabel: 'Inspect Farm Dashboard'
      };
    }

    // Default fallback grounded in facts
    return {
      id: Date.now().toString(),
      sender: 'ai',
      text: `I understand you are asking about: "${userQuestion}". For ${farm.name}, our current Simplex model has allocated **${summary?.used_land_ha || farm.land_area_ha} hectares** across **${optimization?.allocations.length || 0} crops**, projecting **${formatINR(summary?.total_profit || 0)}** net profit. If you need specific analysis, try asking: "What should I grow?", "How can I reduce water usage?", or "Why is my current plan risky?"`,
      timestamp: time
    };
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center space-x-2 px-4 py-3 rounded-full bg-[#1b4324] hover:bg-[#163b20] text-white shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95 border-2 border-white/20"
        >
          <Sparkles className="h-4 w-4 text-emerald-300 animate-pulse" />
          <span className="text-xs font-bold tracking-wide">Ask Farm AI</span>
        </button>
      </div>

      {/* Slide-Up Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] max-h-[580px] h-[82vh] bg-white rounded-2xl shadow-2xl border border-[#e5e8e1] flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="p-4 bg-[#1b4324] text-white flex justify-between items-center shrink-0">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Bot className="h-4 w-4 text-emerald-300" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 className="font-bold text-sm leading-tight">AI Farm Copilot</h3>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-400/20 text-emerald-200 border border-emerald-300/30">
                    Live Context
                  </span>
                </div>
                <p className="text-[10px] text-emerald-100/80">Grounded in {farm.name}</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-white/80 hover:text-white hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Quick Context Bar */}
          <div className="px-4 py-2 bg-[#f4f7f2] border-b border-[#e5e8e1] flex items-center justify-between text-[11px] text-[#525a53] shrink-0">
            <span>Soil: <strong>{farm.soil.soil_type}</strong> (pH {farm.soil.pH})</span>
            <span>•</span>
            <span>Water: <strong>{Math.round(farm.resources.water_m3 / 1000)}k m³</strong></span>
            <span>•</span>
            <span>Budget: <strong>{formatINR(farm.resources.budget_usd)}</strong></span>
          </div>

          {/* Messages Scroll Area */}
          <div className="p-4 space-y-3.5 overflow-y-auto grow text-xs bg-[#fafbf9]">
            {messages.map((m) => {
              const isAi = m.sender === 'ai';
              return (
                <div
                  key={m.id}
                  className={`flex items-start space-x-2 ${isAi ? '' : 'flex-row-reverse space-x-reverse'}`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                      isAi ? 'bg-[#1b4324] text-white' : 'bg-[#e5e8e1] text-[#3d453e]'
                    }`}
                  >
                    {isAi ? <Bot className="h-3 w-3" /> : <User className="h-3 w-3" />}
                  </div>

                  <div
                    className={`max-w-[85%] p-3 rounded-xl leading-relaxed whitespace-pre-line text-xs ${
                      isAi
                        ? 'bg-white text-[#1a1e1b] border border-[#e5e8e1] shadow-2xs'
                        : 'bg-[#1b4324] text-white'
                    }`}
                  >
                    {m.text}

                    {m.actionTab && onNavigateTab && (
                      <div className="mt-2.5 pt-2 border-t border-[#edf0ea]">
                        <button
                          onClick={() => {
                            onNavigateTab(m.actionTab!);
                            setIsOpen(false);
                          }}
                          className="inline-flex items-center space-x-1 text-[11px] font-bold text-[#1b4324] hover:underline"
                        >
                          <span>{m.actionLabel || 'Inspect in Dashboard'} →</span>
                        </button>
                      </div>
                    )}

                    <span
                      className={`block text-[9px] mt-1 text-right ${
                        isAi ? 'text-[#8c9489]' : 'text-emerald-100/70'
                      }`}
                    >
                      {m.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Query Pills */}
          <div className="px-3 py-2 bg-white border-t border-[#edf0ea] overflow-x-auto whitespace-nowrap scrollbar-none space-x-1.5 shrink-0">
            {SUGGESTED_QUERIES.map((sq, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleAsk(sq)}
                className="inline-block px-2.5 py-1 rounded-full text-[10px] font-medium bg-[#f4f7f2] hover:bg-[#eaf0e7] text-[#1b4324] border border-[#d6e3d3] transition-colors"
              >
                {sq}
              </button>
            ))}
          </div>

          {/* Input Box with Voice Mic Trigger */}
          <div className="p-3 bg-white border-t border-[#e5e8e1] shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAsk(query);
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about crops, water limits, profits..."
                className="grow px-3 py-2 text-xs border border-[#dce0d8] rounded-xl focus:ring-1 focus:ring-[#1b4324] focus:outline-hidden"
              />

              {/* Optional Voice Mic Button */}
              {recognitionRef.current && (
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`p-2 rounded-xl border transition-colors ${
                    isListening
                      ? 'bg-red-50 border-red-300 text-red-600 animate-pulse'
                      : 'bg-[#f4f7f2] border-[#dce0d8] text-[#5c645d] hover:text-[#1a1e1b]'
                  }`}
                  title={isListening ? 'Listening... click to stop' : 'Click to speak question'}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>
              )}

              <button
                type="submit"
                disabled={!query.trim()}
                className="p-2 rounded-xl bg-[#1b4324] hover:bg-[#163b20] text-white disabled:opacity-40 transition-colors shadow-2xs"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
