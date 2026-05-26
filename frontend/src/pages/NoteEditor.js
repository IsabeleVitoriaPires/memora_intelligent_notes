import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getNoteById, createNote, updateNote, getCategories, getSettings } from '../services/api';

function NoteEditor(){
const { id } = useParams();
const navigate = useNavigate();

const [title, setTitle] = useState('');
const [content, setContent] = useState('');
const [tags, setTags] = useState('');
const [categories, setCategories] = useState([]);
const [categoryId, setCategoryId] = useState('');
const [loading, setLoading] = useState(false);
const [autoClassify, setAutoClassify] = useState(false);

useEffect(() => {
    getCategories().then(setCategories);
    getSettings().then(settings => {
        const setting = settings.find(s => s.key === 'auto_classify');
        setAutoClassify(setting?.value === 'true');
    })
}, []);

const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
        title,
        content,
        tags: tags.split(',').map(t => t.trim()).filter(t => t),
        category_id: categoryId,
    };

    setLoading(true);
    if(id){
        updateNote(id, data)
            .then(() => navigate('/'))
            .catch(err => alert('Erro ao salvar nota: ' + err.message))
            .finally(() => setLoading(false));
    } else {
        createNote(data)
            .then(res => {
                if (res.warning) alert('Nota criada, mas: ' + res.warning);
                navigate('/');
            })
            .catch(err => alert('Erro ao criar nota: ' + err.message))
            .finally(() => setLoading(false));
    }
};

useEffect(() => {
    if(id){
        getNoteById(id).then(res => {
            setTitle(res.title);
            setContent(res.content);
            setTags(Array.isArray(res.tags) ? res.tags.join(', ') : (res.tags || '').replace(/[{}]/g, ''));
            setCategoryId(res.category_id ?? '');
        });
    }
}, [id]);

    return (
        <div className="min-h-screen bg-gray-950 text-white p-8">
            <div className="max-w-2xl mx-auto">
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
                    {!autoClassify && (
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Categoria</label>
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                        >
                            <option value="">Sem categoria</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>)}
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white py-2.5 rounded-lg font-semibold transition"
                    >
                        {loading ? 'Carregando...' : (id ? 'Salvar Alterações' : 'Criar Nota')}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default NoteEditor;
