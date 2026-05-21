import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getNoteById, createNote, updateNote } from '../services/api';

function NoteEditor(){
const { id } = useParams();
const navigate = useNavigate();

const [title, setTitle] = useState('');
const [content, setContent] = useState('');
const [tags, setTags] = useState('');

const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
        title,
        content,
        tags: tags.split(',').map(t => t.trim()).filter(t => t)
    };

    if(id){
        updateNote(id, data).then(() => navigate('/'));
        
    } else {
        createNote(data).then(() => navigate('/'));
    }
};

useEffect(() => {
    if(id){
            getNoteById(id).then(res => {
            setTitle(res.title);
            setContent(res.content);
            setTags(Array.isArray(res.tags) ? res.tags.join(', ') : (res.tags || '').replace(/[{}]/g, ''));
        })
    }
}, [id]);

    return (
        <div className="min-h-screen bg-gray-950 text-white p-8">
            <div className="max-w-2xl mx-auto">
                {/* Cabeçalho */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-purple-400">
                        {id ? 'Editar Nota' : 'Nova Nota'}
                    </h1>
                    <button
                        onClick={() => navigate('/')}
                        className="text-gray-400 hover:text-white transition"
                    >
                        ← Voltar
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Título</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                            placeholder="Título da nota"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Conteúdo</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={8}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 resize-none"
                            placeholder="Escreva sua nota..."
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Tags (separadas por vírgula)</label>
                        <input
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                            placeholder="ex: react, php, docker"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-purple-600 hover:bg-purple-500 text-white py-2.5 rounded-lg font-semibold transition"
                    >
                        {id ? 'Salvar Alterações' : 'Criar Nota'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default NoteEditor;