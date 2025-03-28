import React, { useState, KeyboardEvent } from 'react';

interface InputProps {
    onSendMessage: (text: string) => void;
}

const Input: React.FC<InputProps> = ({ onSendMessage }) => {
    const [text, setText] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onSendMessage(text);
            setText('');
        }
    };

    return (
        <div style={{ display: 'flex', padding: '10px' }}>
            <input
                type="text"
                value={text}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <button onClick={() => { onSendMessage(text); setText(''); }} style={{ padding: '8px 12px', marginLeft: '5px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}>Enviar</button>
        </div>
    );
};

export default Input;