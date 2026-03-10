import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Search, Sparkles, Send, User, Bot, Building2, ChevronRight, Loader2 } from 'lucide-react';
import { getAllBusinessesForSuperAdmin, getBusinessData, getAllCustomers } from '../services/firebaseService';
import type { BusinessAdminData } from '../services/firebaseService';
import type { Business, Customer } from '../types';
import Markdown from 'react-markdown';

interface Message {
  role: 'user' | 'model';
  content: string;
}

const AdminKloyPage: React.FC = () => {
  const [businesses, setBusinesses] = useState<BusinessAdminData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [businessCustomers, setBusinessCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingBusiness, setLoadingBusiness] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    "¿Quién es mi mejor cliente?",
    "¿Qué promoción me sugieres?",
    "¿Cuántos clientes tengo en total?",
    "¿Cómo puedo mejorar la lealtad?",
    "Resumen de actividad reciente"
  ];

  useEffect(() => {
    document.title = 'Kloy AI Agent | Super Admin';
    fetchBusinesses();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const data = await getAllBusinessesForSuperAdmin();
      setBusinesses(data);
    } catch (error) {
      console.error("Error fetching businesses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBusiness = async (businessId: string) => {
    setSelectedBusinessId(businessId);
    setLoadingBusiness(true);
    setMessages([]); // Clear chat when switching business
    try {
      const [data, customers] = await Promise.all([
        getBusinessData(businessId),
        getAllCustomers(businessId)
      ]);
      setSelectedBusiness(data);
      setBusinessCustomers(customers);
      
      // Initial greeting from Kloy
      setMessages([{
        role: 'model',
        content: `¡Hola! Soy **Kloy**, el agente de IA de **${data?.name}**. He analizado tus **${customers.length}** clientes y estoy listo para ayudarte a optimizar tu estrategia de lealtad. ¿En qué puedo apoyarte hoy?`
      }]);
    } catch (error) {
      console.error("Error fetching business details:", error);
    } finally {
      setLoadingBusiness(false);
    }
  };

  const filteredBusinesses = businesses.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = async (text?: string, e?: React.FormEvent) => {
    e?.preventDefault();
    const messageToSend = text || input.trim();
    if (!messageToSend || !selectedBusiness || isTyping) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: messageToSend }]);
    setIsTyping(true);

    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not defined");
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      // Prepare context for Kloy
      const businessContext = {
        name: selectedBusiness.name,
        plan: selectedBusiness.plan,
        stampsGoal: selectedBusiness.cardSettings?.stampsGoal,
        reward: selectedBusiness.cardSettings?.reward,
        totalCustomers: businessCustomers.length,
        customersSummary: businessCustomers.slice(0, 50).map(c => ({
          name: c.name,
          stamps: c.stamps,
          rewards: c.rewardsRedeemed,
          lastVisit: c.enrollmentDate
        }))
      };

      const systemInstruction = `Eres Kloy, un agente de IA experto en marketing de lealtad y análisis de datos para Loyalfly. 
      Tu objetivo es ayudar al dueño del negocio "${businessContext.name}" a crecer.
      
      DATOS DEL NEGOCIO:
      - Nombre: ${businessContext.name}
      - Plan: ${businessContext.plan}
      - Meta de sellos: ${businessContext.stampsGoal}
      - Recompensa: ${businessContext.reward}
      - Total de clientes: ${businessContext.totalCustomers}
      
      CONTEXTO DE CLIENTES (Muestra de los más recientes/activos):
      ${JSON.stringify(businessContext.customersSummary)}
      
      INSTRUCCIONES:
      1. Responde siempre en español.
      2. Sé profesional, analítico y proactivo.
      3. Si te preguntan por el "mejor cliente", busca en los datos proporcionados quién tiene más sellos o premios.
      4. Sugiere promociones basadas en la recompensa actual del negocio.
      5. Usa Markdown para dar formato a tus respuestas (negritas, listas, etc.).
      6. No inventes datos que no estén en el contexto. Si no sabes algo, admítelo y sugiere cómo obtener esa información.`;

      // Gemini requires the first message to be from 'user'. 
      // We skip the initial 'model' greeting if it's the first message.
      const history = messages.concat({ role: 'user', content: messageToSend });
      const validHistory = history[0].role === 'model' ? history.slice(1) : history;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: validHistory.map(m => ({
          role: m.role,
          parts: [{ text: m.content }]
        })),
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      const aiResponse = response.text || "Lo siento, tuve un problema al procesar tu solicitud.";
      setMessages(prev => [...prev, { role: 'model', content: aiResponse }]);
    } catch (error) {
      console.error("Error calling Gemini:", error);
      setMessages(prev => [...prev, { role: 'model', content: "Hubo un error al conectar con mi cerebro de IA. Por favor, intenta de nuevo." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black tracking-tight flex items-center gap-2">
            <Sparkles className="text-[#4D17FF] h-8 w-8" />
            Agente IA - Kloy
          </h1>
          <p className="text-gray-500">Prueba la inteligencia de Kloy con cualquier negocio de la plataforma.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 overflow-hidden">
        {/* Business Selector Sidebar */}
        <div className="lg:col-span-1 bg-white border border-gray-200 rounded-xl flex flex-col overflow-hidden shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Buscar negocio..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4D17FF]/20 focus:border-[#4D17FF] transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-2">
                <Loader2 className="h-6 w-6 animate-spin text-gray-300" />
                <span className="text-xs text-gray-400 font-medium">Cargando negocios...</span>
              </div>
            ) : filteredBusinesses.length > 0 ? (
              filteredBusinesses.map(business => (
                <button
                  key={business.id}
                  onClick={() => handleSelectBusiness(business.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all text-left ${
                    selectedBusinessId === business.id 
                      ? 'bg-[#4D17FF]/5 border border-[#4D17FF]/20 text-[#4D17FF]' 
                      : 'hover:bg-gray-50 text-gray-700 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      selectedBusinessId === business.id ? 'bg-[#4D17FF] text-white' : 'bg-gray-100 text-gray-400'
                    }`}>
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-bold truncate">{business.name}</p>
                      <p className="text-[10px] opacity-70 uppercase tracking-wider font-bold">{business.plan || 'Gratis'}</p>
                    </div>
                  </div>
                  <ChevronRight className={`h-4 w-4 flex-shrink-0 ${selectedBusinessId === business.id ? 'opacity-100' : 'opacity-0'}`} />
                </button>
              ))
            ) : (
              <div className="text-center py-10 text-gray-400 text-sm">No se encontraron negocios.</div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3 bg-white border border-gray-200 rounded-xl flex flex-col overflow-hidden shadow-sm relative">
          {!selectedBusinessId ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="h-20 w-20 bg-[#4D17FF]/10 rounded-full flex items-center justify-center">
                <Sparkles className="h-10 w-10 text-[#4D17FF]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-black">Selecciona un negocio para comenzar</h3>
                <p className="text-gray-500 max-w-sm mx-auto mt-2">
                  Elige un negocio de la lista de la izquierda para que Kloy analice sus datos y puedas interactuar con él.
                </p>
              </div>
            </div>
          ) : loadingBusiness ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
              <Loader2 className="h-10 w-10 animate-spin text-[#4D17FF]" />
              <p className="text-gray-500 font-medium animate-pulse">Kloy está analizando los datos de {businesses.find(b => b.id === selectedBusinessId)?.name}...</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-[#4D17FF] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#4D17FF]/20">
                    <Bot className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-black flex items-center gap-2">
                      Kloy <span className="text-[10px] bg-[#4D17FF]/10 text-[#4D17FF] px-2 py-0.5 rounded-full uppercase tracking-widest">Agente IA</span>
                    </h3>
                    <p className="text-xs text-gray-500">Analizando: <span className="font-bold text-gray-700">{selectedBusiness?.name}</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {businessCustomers.slice(0, 3).map((c, i) => (
                      <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500">
                        {c.name.charAt(0)}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-gray-400">+{businessCustomers.length} clientes</span>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`h-8 w-8 rounded-lg flex-shrink-0 flex items-center justify-center ${
                        m.role === 'user' ? 'bg-gray-100 text-gray-500' : 'bg-[#4D17FF] text-white'
                      }`}>
                        {m.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </div>
                      <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                        m.role === 'user' 
                          ? 'bg-black text-white rounded-tr-none' 
                          : 'bg-gray-50 text-gray-800 border border-gray-100 rounded-tl-none'
                      }`}>
                        <div className="prose prose-sm max-w-none">
                          <Markdown>{m.content}</Markdown>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex gap-3 max-w-[85%]">
                      <div className="h-8 w-8 rounded-lg bg-[#4D17FF] text-white flex items-center justify-center">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl rounded-tl-none flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Quick Questions */}
                {!isTyping && messages.length > 0 && messages[messages.length - 1].role === 'model' && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {quickQuestions.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(q)}
                        className="text-xs bg-white border border-gray-200 hover:border-[#4D17FF] hover:text-[#4D17FF] text-gray-600 px-3 py-2 rounded-full transition-all shadow-sm font-medium"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
                
                <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-100 bg-white">
                <form onSubmit={(e) => handleSendMessage(undefined, e)} className="relative">
                  <input 
                    type="text" 
                    placeholder="Pregúntale a Kloy sobre este negocio..."
                    className="w-full pl-4 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4D17FF]/20 focus:border-[#4D17FF] transition-all"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isTyping}
                  />
                  <button 
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-black text-white rounded-xl flex items-center justify-center hover:bg-gray-800 disabled:bg-gray-200 disabled:cursor-not-allowed transition-all"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </form>
                <p className="text-[10px] text-center text-gray-400 mt-3 uppercase tracking-widest font-bold">
                  Kloy puede cometer errores. Verifica la información importante.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminKloyPage;
