import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Vault from './pages/Vault';
import NoteEditor from './pages/NoteEditor';
import Chat from './pages/Chat';
import Category from './pages/Categories';
import Settings from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Vault />} />
        <Route path="/note/new" element={<NoteEditor />} />
        <Route path="/note/:id" element={<NoteEditor />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/categories" element={<Category />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;