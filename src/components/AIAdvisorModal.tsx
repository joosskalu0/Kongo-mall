import React, { useState } from 'react';
import { Product, AIAdvisorMessage } from '../types';
import { X, Sparkles, Send, ShoppingBag, Eye } from 'lucide-react';

interface AIAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const AIAdvisorModal: React.FC<AIAdvisorModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct
}) => {
  if (!isOpen) return null;

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<AIAdvisorMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: 'Bonjour ! Je suis votre Conseiller Artisanal virtuel. Dites-moi pour qui ou pour quelle occasion vous cherchez une création fait-main (anniversaire, mariage, cadeau de crémaillère, pièce de décoration...).'
    }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    const userMsg: AIAdvisorMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: userText
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText })
      });

      const data = await response.json();

      const assistantMsg: AIAdvisorMessage = {
        id: 'assistant-' + Date.now(),
        sender: 'assistant',
        text: data.reply || "Voici ce que je vous suggère pour cette occasion :",
        recommendedProductIds: data.recommendations || []
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          sender: 'assistant',
          text: "Je vous suggère d'explorer nos créations en Céramique (Vase Cannelé) ou en Ébénisterie (Planche en noyer) !",
          recommendedProductIds: ['prod-1', 'prod-3']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/70 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 my-auto flex flex-col h-[80vh] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-stone-900 text-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-amber-900/80 rounded-lg">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-amber-50">
                Conseiller Artisanal AI
              </h3>
              <p className="text-[11px] text-stone-400">
                Idées cadeaux & conseils décoration personnalisés
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-stone-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-amber-900 text-amber-50 rounded-br-xs'
                    : 'bg-white text-stone-800 border border-stone-200 rounded-bl-xs'
                }`}
              >
                {msg.text}

                {/* Recommended Products Cards inside chat */}
                {msg.recommendedProductIds && msg.recommendedProductIds.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-stone-200 space-y-2">
                    <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
                      Créations suggérées :
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {msg.recommendedProductIds.map((id) => {
                        const rec = products.find((p) => p.id === id);
                        if (!rec) return null;
                        return (
                          <div
                            key={rec.id}
                            onClick={() => {
                              onClose();
                              onSelectProduct(rec);
                            }}
                            className="p-2 bg-stone-50 border border-stone-200 rounded-xl flex items-center gap-2 cursor-pointer hover:bg-amber-50 hover:border-amber-700/50 transition-all"
                          >
                            <img
                              src={rec.images[0]}
                              alt={rec.name}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 object-cover rounded-lg shrink-0"
                            />
                            <div className="min-w-0">
                              <h5 className="font-serif text-xs font-bold text-stone-900 truncate">
                                {rec.name}
                              </h5>
                              <span className="text-xs text-amber-900 font-bold">{rec.price} $</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-stone-400 italic">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-700" />
              L'artisan réfléchit à vos meilleures options...
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 border-t border-stone-200 bg-white flex gap-2">
          <input
            type="text"
            placeholder="Ex: Idée cadeau mariage pour un couple passionné de déco..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-stone-100 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-5 py-2.5 bg-amber-900 hover:bg-amber-950 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
