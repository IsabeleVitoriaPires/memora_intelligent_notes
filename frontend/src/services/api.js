const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:85';

export const getNotes = async () => {
    const res = await fetch(`${BASE_URL}/notes`);
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

export const getNoteById = async (id) => {
    const res = await fetch(`${BASE_URL}/notes/${id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
};

export const createNote = async (data) => {
    const res = await fetch(`${BASE_URL}/notes`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
};

export const updateNote = async (id, data) => {
    const res = await fetch(`${BASE_URL}/notes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
};

export const deleteNote = async (id) => {
    const res = await fetch(`${BASE_URL}/notes/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
};

export const sendMessage = async (message) => {
    const res = await fetch(`${BASE_URL}/chat`, {
        method: 'POST',
        body: JSON.stringify({ message }),
        headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
};

export const getChatHistory = async () => {
    const res = await fetch(`${BASE_URL}/chat/history`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
};

export const getCategories = async () => {
    const res = await fetch(`${BASE_URL}/categories`);
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

export const createCategory = async (data) => {
    const res = await fetch(`${BASE_URL}/categories`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
};

export const deleteCategory = async (id) => {
    const res = await fetch(`${BASE_URL}/categories/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
};

 export const clearChatHistory = async () => {
    const res = await fetch(`${BASE_URL}/chat`, { method: 'DELETE' });
    
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
};

export const getSettings = async () => {
    const res = await fetch(`${BASE_URL}/settings`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
};

export const updateSettings = async (key, value) => {
    const res = await fetch(`${BASE_URL}/settings`, {
        method: 'PUT',
        body: JSON.stringify({ key, value }),
        headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
};