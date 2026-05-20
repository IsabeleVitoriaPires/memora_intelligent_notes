import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotes, deleteNote } from '../services/api';

function Vault() {
    
    const [notes, setNotes] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getNotes().then(setNotes).finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        getNotes().then((data) => {
            setNotes(data);
        });
    }, []);

    const handleDelete = (id) => {
        deleteNote(id).then(() => {
            setNotes(notes.filter(note => note.id !== id));
    });
}

    return (
        <div className="min-h-screen bg-gray-950 text-white p-8">
            {/* Cabeçalho */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-purple-400">Memora</h1>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate('/chat')}
                        className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition"
                    >
                        💬 Chat
                    </button>
                    <button
                        onClick={() => navigate('/note/new')}
                        className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg transition"
                    >
                        + Nova Nota
                    </button>
                </div>
            </div>

            {/* Lista de notas */}
            {notes.length === 0 ? (
                <p className="text-gray-500 text-center mt-20">Nenhuma nota ainda. Crie sua primeira nota!</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {notes.map(note => (
                        <div key={note.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-purple-700 transition">
                            <h2 className="text-lg font-semibold mb-2">{note.title}</h2>
                            <p className="text-gray-400 text-sm mb-4 line-clamp-3">{note.content}</p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => navigate(`/note/${note.id}`)}
                                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-sm py-1.5 rounded-lg transition"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(note.id)}
                                    className="flex-1 bg-red-900 hover:bg-red-800 text-sm py-1.5 rounded-lg transition"
                                >
                                    Excluir
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Vault;