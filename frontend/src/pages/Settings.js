import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSettings, updateSettings, getCategories } from '../services/api';

function Settings() {
    const [autoClassify, setAutoClassify] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        Promise.all([getSettings(), getCategories()]).then(([settings, cats]) => {
            const setting = settings.find(s => s.key === 'auto_classify');
            setAutoClassify(setting?.value === 'true');
            setCategories(cats);
        }).finally(() => setLoading(false));
    }, []);

    const handleToggle = () => {
        const newValue = !autoClassify;
        setSaving(true);
        updateSettings('auto_classify', String(newValue)).then(() => {
            setAutoClassify(newValue);
        }).finally(() => setSaving(false));
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-2xl mx-auto px-6 py-5 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-purple-400">Configurações</h1>
                    <button
                        onClick={() => navigate('/')}
                        className="text-gray-400 hover:text-white transition text-sm"
                    >
                        ← Voltar
                    </button>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-6 py-8">
                {loading ? (
                    <div className="text-center mt-20 text-gray-500">Carregando...</div>
                ) : (
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-white">Classificação automática com IA</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Quando ativado, toda nova nota é categorizada automaticamente pela IA.
                                </p>
                            </div>
                            <button
                                onClick={handleToggle}
                                disabled={saving}
                                className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                                    autoClassify ? 'bg-purple-600' : 'bg-gray-700'
                                }`}
                            >
                                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                                    autoClassify ? 'translate-x-5' : 'translate-x-0'
                                }`} />
                            </button>
                        </div>
                        {autoClassify && categories.length === 0 && (
                            <div className="mt-4 flex items-start gap-2 bg-yellow-900/20 border border-yellow-700/40 rounded-lg px-4 py-3">
                                <span className="text-yellow-400 text-sm">⚠</span>
                                <p className="text-yellow-400 text-xs">
                                    Nenhuma categoria criada. A IA não conseguirá classificar as notas sem categorias.{' '}
                                    <button onClick={() => navigate('/categories')} className="underline hover:text-yellow-300 transition">
                                        Criar categorias
                                    </button>
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

export default Settings;
