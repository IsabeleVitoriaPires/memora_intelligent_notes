const BASE_URL = 'http://localhost:85';

export const getNotes = async () => {
    const res = await fetch(`${BASE_URL}/notes`);
    return res.json();
}

export const getNoteById = (id) => 
    fetch(`${BASE_URL}/notes/${id}`).then(res => res.json());


export const createNote = (data) => {
    
    return fetch(`${BASE_URL}/notes`, {

        method: 'POST',

        body: JSON.stringify(data),

        headers: {

            'Content-Type': 'application/json'

        }

    }).then(res => res.json())

}

export const updateNote = (id, data) => {
    
    return fetch(`${BASE_URL}/notes/${id}`, {

        method: 'PUT',

        body: JSON.stringify(data),

        headers: {

            'Content-Type': 'application/json'

        }

    }).then(res => res.json())

}

export const deleteNote = (id) => {
    
    return fetch(`${BASE_URL}/notes/${id}`, {method: 'DELETE'}).then(res => res.json())

}

export const sendMessage = (message) => {
    
    return fetch(`${BASE_URL}/chat`, {

        method: 'POST',

        body: JSON.stringify({message}),

        headers: {

            'Content-Type': 'application/json'

        }

    }).then(res => res.json())

}

export const getChatHistory = () => {
    
    return fetch(`${BASE_URL}/chat/history`).then(res => res.json())

}