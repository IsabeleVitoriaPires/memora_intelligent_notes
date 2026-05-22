import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotes, deleteNote } from '../services/api';

function Vault() {
    const [notes, setNotes] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getNotes().then(setNotes).finally(() => setLoading(false));
    }, []);

    const handleDelete = (id) => {
        deleteNote(id).then(() => {
            setNotes(notes.filter(note => note.id !== id));
        });
    };

    const filtered = notes.filter(note =>
        note.title.toLowerCase().includes(search.toLowerCase()) ||
        note.content.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            {/* Header */}
            <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-purple-400">Memora</h1>
                        <p className="text-gray-500 text-sm mt-0.5">Suas notas, sua memória com IA</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/chat')}
                            className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition text-sm"
                        >
                            Chat
                        </button>
                        <button
                            onClick={() => navigate('/note/new')}
                            className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg transition text-sm"
                        >
                            + Nova Nota
                        </button>
                        <button
                            onClick={() => navigate('/categories')}
                            className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg transition text-sm"
                        >
                            Categorias
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-8">
                {/* Stats + Search */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div className="flex gap-6">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            <span><strong className="text-white">{notes.length}</strong> notas</span>
                        </div>
                    </div>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar notas..."
                        className="w-full sm:w-72 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                    />
                </div>

                {/* Content */}
                {loading ? (
                    <div className="text-center mt-20 text-gray-500">Carregando...</div>
                ) : filtered.length === 0 && notes.length === 0 ? (
                    <div className="text-center mt-20">
                        <h2 className="text-xl font-semibold text-gray-300 mb-2">Nenhuma nota ainda</h2>
                        <p className="text-gray-500 mb-6">Crie sua primeira nota e comece a conversar com a IA sobre ela.</p>
                        <button
                            onClick={() => navigate('/note/new')}
                            className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2.5 rounded-lg transition"
                        >
                            Criar primeira nota
                        </button>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center mt-20 text-gray-500">Nenhuma nota encontrada para "{search}"</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map(note => (
                            <div
                                key={note.id}
                                className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-purple-700 hover:shadow-lg hover:shadow-purple-900/10 transition group flex flex-col"
                            >
                                <h2 className="text-lg font-semibold mb-2 group-hover:text-purple-300 transition">{note.title}</h2>
                                <p className="text-gray-400 text-sm mb-4 line-clamp-3">{note.content}</p>
                                <div className="mt-auto">
                                    {(note.category_name || (note.tags && note.tags.length > 0)) && (
                                        <div className="flex flex-wrap gap-1.5 mb-3">
                                            {note.category_name && (
                                                <span className="text-xs bg-purple-900/40 text-purple-300 px-2 py-0.5 rounded-full">
                                                    {note.category_name}
                                                </span>
                                            )}
                                            {note.tags && note.tags.length > 0 && (
                                                (Array.isArray(note.tags) ? note.tags : note.tags.replace(/[{}]/g, '').split(',')).map((tag, i) => (
                                                    <span key={i} className="text-xs bg-purple-900/40 text-purple-300 px-2 py-0.5 rounded-full">
                                                        {tag.trim()}
                                                    </span>
                                                ))
                                            )}
                                        </div>
                                    )}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => navigate(`/note/${note.id}`)}
                                        className="flex-1 bg-gray-800 hover:bg-gray-700 text-sm py-1.5 rounded-lg transition"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(note.id)}
                                        className="flex-1 bg-red-900/60 hover:bg-red-800 text-sm py-1.5 rounded-lg transition"
                                    >
                                        Excluir
                                    </button>
                                </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default Vault;