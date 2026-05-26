import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendMessage, getChatHistory, clearChatHistory } from '../services/api';

function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const bottomRef = useRef(null);

    useEffect(() => {
        getChatHistory().then(data => {
            const history = data.flatMap(item => [
                { role: 'user', text: item.user_message },
                { role: 'ai', text: item.ai_response }
            ]);
            setMessages(history);
        });
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage = input;
        setInput('');
        setLoading(true);

        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);

        sendMessage(userMessage)
            .then(response => {
                setMessages(prev => [...prev, { role: 'ai', text: response }]);
            })
            .catch(() => {
            setMessages(prev => [...prev, {role: 'ai', text: 'Erro ao obter resposta.'}])
        })
        .finally(() => setLoading(false));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white flex flex-col">
            {/* Cabeçalho */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800">
                <h1 className="text-xl font-bold text-purple-400">💬 Memora — Chat</h1>
                <button
                    onClick={() => navigate('/')}
                    className="text-gray-400 hover:text-white transition"
                >
                    ← Voltar
                </button>
                <button
                    onClick={() => {
                        if (window.confirm('Deseja apagar todo o histórico?')) {
                            clearChatHistory().then(() => setMessages([]));
                        }
                    }}
                    className="text-gray-400 hover:text-white transition"
                >
                    Limpar Histórico
                </button>
            </div>
            {/* Lista de mensagens */}
            <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
                {messages.length === 0 && (
                    <p className="text-gray-500 text-center mt-20">
                        Pergunte algo sobre suas notas...
                    </p>
                )}
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`max-w-xl px-4 py-3 rounded-xl text-sm ${
                            msg.role === 'user'
                                ? 'bg-purple-700 self-end text-white'
                                : 'bg-gray-800 self-start text-gray-200'
                        }`}
                    >
                        {msg.text}
                    </div>
                ))}
                {loading && (
                    <div className="bg-gray-800 self-start px-4 py-3 rounded-xl text-sm text-gray-400">
                        digitando...
                    </div>
                )}
                {/* Elemento invisível no fim pra fazer o scroll automático */}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-6 py-4 border-t border-gray-800 flex gap-3">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Pergunte algo sobre suas notas..."
                    className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                />
                <button
                    onClick={handleSend}
                    disabled={loading}
                    className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 px-5 py-2 rounded-lg font-semibold transition"
                >
                    Enviar
                </button>
            </div>
        </div>
    );
}

export default Chat;
