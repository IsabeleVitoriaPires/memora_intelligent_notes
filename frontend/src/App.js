import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Vault from './pages/Vault';
import NoteEditor from './pages/NoteEditor';
import Chat from './pages/Chat';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Vault />} />
        <Route path="/note/new" element={<NoteEditor />} />
        <Route path="/note/:id" element={<NoteEditor />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;