import React from 'react';

interface MessageProps {
    text: string;
    sender: 'user' | 'bot';
}

const Message: React.FC<MessageProps> = ({ text, sender }) => (
    <div style={{ textAlign: sender === 'user' ? 'right' : 'left', marginBottom: '10px' }}>
        <div style={{ display: 'inline-block', padding: '10px', borderRadius: '8px', backgroundColor: sender === 'user' ? '#DCF8C6' : '#E0E0E0' }}>
            <strong style={{ display: 'block', marginBottom: '5px' }}>{sender === 'user' ? 'Cliente' : 'Chef'}</strong>
            <span>{text}</span>
        </div>
    </div>
);

export default Message;