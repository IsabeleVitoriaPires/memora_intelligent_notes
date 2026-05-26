import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories, createCategory, deleteCategory } from '../services/api';

function Categories() {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [color, setColor] = useState('#a855f7');
    const [confirmDelete, setConfirmDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getCategories().then(setCategories);
    }, []);

    const handleCreate = (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        createCategory({ name, color }).then(() => {
            setName('');
            getCategories().then(setCategories);
        });
    };

    const handleDelete = () => {
        deleteCategory(confirmDelete.id).then(() => {
            setCategories(categories.filter(c => c.id !== confirmDelete.id));
            setConfirmDelete(null);
        });
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-2xl mx-auto px-6 py-5 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-purple-400">Categorias</h1>
                    <button
                        onClick={() => navigate('/')}
                        className="text-gray-400 hover:text-white transition text-sm"
                    >
                        ← Voltar
                    </button>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-6 py-8">
                {/* Form */}
                <form onSubmit={handleCreate} className="flex gap-3 mb-8">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nome da categoria"
                        className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                        required
                    />
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-10 h-10 rounded-lg border border-gray-700 bg-gray-900 cursor-pointer"
                    />
                    <button
                        type="submit"
                        className="bg-purple-600 hover:bg-purple-500 px-5 py-2 rounded-lg text-sm font-semibold transition"
                    >
                        Criar
                    </button>
                </form>

                {/* List */}
                {categories.length === 0 ? (
                    <p className="text-gray-500 text-center mt-12">Nenhuma categoria criada ainda.</p>
                ) : (
                    <div className="flex flex-col gap-2">
                        {categories.map(cat => (
                            <div
                                key={cat.id}
                                className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-lg px-4 py-3"
                            >
                                <div className="flex items-center gap-3">
                                    <span
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: cat.color || '#a855f7' }}
                                    ></span>
                                    <span className="text-sm">{cat.name}</span>
                                </div>
                                <button
                                    onClick={() => setConfirmDelete({ id: cat.id, name: cat.name })}
                                    className="text-gray-500 hover:text-red-400 transition text-sm"
                                >
                                    Excluir
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            {confirmDelete && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-sm w-full mx-4">
                        <h2 className="text-white font-semibold mb-2">Excluir categoria</h2>
                        <p className="text-gray-400 text-sm mb-1">
                            Tem certeza que deseja excluir <strong className="text-white">"{confirmDelete.name}"</strong>?
                        </p>
                        <p className="text-gray-500 text-xs mb-6">
                            As notas associadas a essa categoria ficarão sem categoria.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setConfirmDelete(null)}
                                className="flex-1 bg-gray-800 hover:bg-gray-700 text-sm py-2 rounded-lg transition"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 bg-red-700 hover:bg-red-600 text-sm py-2 rounded-lg transition"
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Categories;
