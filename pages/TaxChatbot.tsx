import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI, Chat } from '@google/genai';

const Header: React.FC<{ title: string; onBack: () => void; }> = ({ title, onBack }) => (
    <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-b border-border-light dark:border-border-dark">
        <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
                <button onClick={onBack} className="p-2 text-text-light dark:text-text-dark interactive-scale" aria-label="Go back">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="text-lg font-bold text-text-light dark:text-text-dark">{title}</h1>
                <div className="w-8"></div>
            </div>
        </div>
    </header>
);

interface Message {
    role: 'user' | 'model';
    text: string;
    showProButton?: boolean;
}

const MessageBubble: React.FC<{ message: Message; onUpgradeClick: () => void }> = ({ message, onUpgradeClick }) => {
    const isUser = message.role === 'user';
    return (
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
            <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl shadow-sm ${isUser ? 'bg-primary text-white rounded-br-lg' : 'bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark rounded-bl-lg'}`}>
                    <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{message.text}</p>
                </div>
            </div>
            {message.showProButton && !isUser && (
                <button
                    onClick={onUpgradeClick}
                    className="mt-2 ml-1 flex items-center gap-2 px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200 text-xs font-bold rounded-full hover:bg-yellow-200/70 dark:hover:bg-yellow-900/60 transition-colors interactive-scale"
                >
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                    Learn about Sparkpay Pro
                </button>
            )}
        </div>
    );
};


const TypingIndicator: React.FC = () => (
    <div className="flex justify-start">
        <div className="px-4 py-3 rounded-2xl bg-surface-light dark:bg-surface-dark rounded-bl-lg shadow-sm">
            <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-subtext-light dark:bg-subtext-dark rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-subtext-light dark:bg-subtext-dark rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-subtext-light dark:bg-subtext-dark rounded-full animate-bounce"></div>
            </div>
        </div>
    </div>
);

const SuggestedPrompts: React.FC<{ onPromptClick: (prompt: string) => void }> = ({ onPromptClick }) => {
    const prompts = [
        "How can I save on tax?",
        "Explain rent relief for me.",
        "Can I get a report of my taxes?",
    ];

    return (
        <div className="flex flex-col items-start gap-2 py-2">
            {prompts.map(prompt => (
                <button
                    key={prompt}
                    onClick={() => onPromptClick(prompt)}
                    className="px-4 py-2 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-full text-sm font-medium text-primary dark:text-accent-blue hover:bg-primary/10 dark:hover:bg-accent-blue/20 transition-colors interactive-scale"
                >
                    {prompt}
                </button>
            ))}
        </div>
    );
};

const formatCurrency = (amount: number) => `₦${amount.toLocaleString('en-NG')}`;

const TaxChatbot: React.FC = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

    useEffect(() => {
        const initChat = async () => {
            try {
                if (!process.env.API_KEY) {
                  throw new Error("API Key not found. Please configure your environment.");
                }
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                chatRef.current = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    config: {
                        systemInstruction: "You are a friendly and helpful tax advisor from Sparkpay, a Nigerian fintech company. Your goal is to provide accurate tax information for Nigerian users. When appropriate, subtly mention how Sparkpay Pro features like auto-filing for tax relief, downloading PDF reports, and advanced salary forecasting can simplify their lives. Do not be pushy, but be clear about the benefits. When you mention a Pro feature, try to use keywords like 'Sparkpay Pro', 'auto-file', or 'PDF report'.",
                    },
                });

                setMessages([
                    { role: 'model', text: "Hello! I'm your Sparkpay Tax Assistant. How can I help you understand your tax situation today?" }
                ]);
            } catch (error) {
                 console.error('Initialization error:', error);
                 setMessages([{ role: 'model', text: 'There was an issue setting up the chat. Please check your API key and try again.' }]);
            }
        };
        initChat();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const sendMessageToModel = async (messageText: string) => {
        setIsLoading(true);
        try {
            if (!chatRef.current) {
                throw new Error("Chat not initialized");
            }

            const response = await chatRef.current.sendMessage({ message: messageText });
            const modelResponseText = response.text;
            
            const proKeywords = ['sparkpay pro', 'auto-file', 'auto-filing', 'pdf report', 'tax report', 'rent relief', 'upgrade', 'pro feature'];
            const showProButton = proKeywords.some(keyword => modelResponseText.toLowerCase().includes(keyword));

            const modelMessage: Message = { 
                role: 'model', 
                text: modelResponseText,
                showProButton,
            };
            setMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage: Message = { role: 'model', text: "Sorry, I'm having trouble connecting right now. Please try again later." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestedPromptClick = (prompt: string) => {
        if (isLoading) return;
        const userMessage: Message = { role: 'user', text: prompt };
        setMessages(prev => [...prev, userMessage]);
        sendMessageToModel(prompt);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', text: input.trim() };
        setMessages(prev => [...prev, userMessage]);
        const messageToSend = input.trim();
        setInput('');
        await sendMessageToModel(messageToSend);
    };
    
    return (
        <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark">
            <Header title="AI Tax Chat" onBack={() => navigate(-1)} />
            <main className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <MessageBubble key={index} message={msg} onUpgradeClick={() => setIsUpgradeModalOpen(true)} />
                ))}
                {messages.length === 1 && !isLoading && <SuggestedPrompts onPromptClick={handleSuggestedPromptClick} />}
                {isLoading && <TypingIndicator />}
                <div ref={messagesEndRef} />
            </main>
            <footer className="p-4 bg-background-light dark:bg-background-dark border-t border-border-light dark:border-border-dark">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about your taxes..."
                        className="form-input flex-1 w-full rounded-full border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark h-12 px-5 placeholder:text-subtext-light dark:placeholder:text-subtext-dark focus:ring-primary focus:border-primary"
                        disabled={isLoading}
                        aria-label="Chat input"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="size-12 bg-primary text-white rounded-full flex items-center justify-center disabled:bg-primary/50 interactive-scale shrink-0"
                        aria-label="Send message"
                    >
                        <span className="material-symbols-outlined">send</span>
                    </button>
                </form>
            </footer>
             {isUpgradeModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setIsUpgradeModalOpen(false)}>
                    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center transform transition-all" onClick={e => e.stopPropagation()}>
                        <span className="material-symbols-outlined text-4xl text-primary dark:text-accent-blue mb-3" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                        <h3 className="text-xl font-bold text-text-light dark:text-text-dark">Upgrade to Sparkpay Pro</h3>
                        <p className="text-subtext-light dark:text-subtext-dark mt-2 mb-6">Automate your tax filing and unlock powerful features to maximize your savings.</p>
                        
                        <ul className="space-y-3 text-left mb-8">
                            <li className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-success-light dark:text-success-dark">check_circle</span>
                                <span className="text-text-light dark:text-text-dark">Auto-file with NRS for tax relief</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-success-light dark:text-success-dark">check_circle</span>
                                <span className="text-text-light dark:text-text-dark">Download audit-proof PDF reports</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-success-light dark:text-success-dark">check_circle</span>
                                <span className="text-text-light dark:text-text-dark">Advanced salary forecasting</span>
                            </li>
                        </ul>

                        <button onClick={() => setIsUpgradeModalOpen(false)} className="w-full h-14 bg-primary text-white font-bold rounded-lg text-lg hover:bg-primary/90 transition-colors duration-300 interactive-scale">
                            Upgrade Now for {formatCurrency(500)}/month
                        </button>
                        <button onClick={() => setIsUpgradeModalOpen(false)} className="w-full h-14 mt-3 text-subtext-light dark:text-subtext-dark font-bold rounded-lg hover:bg-primary/10 transition-colors duration-300 interactive-scale">
                            Maybe Later
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaxChatbot;
