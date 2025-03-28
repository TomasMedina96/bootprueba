import React, { useState, useRef, useEffect } from 'react';
import Message from './Message';
import Input from './Input';
import { io, Socket } from 'socket.io-client';

interface MessageType {
    text: string;
    sender: 'user' | 'bot';
    isInitialBotMessage?: boolean;
    options?: { label: string; value: string }[];
}

const Chatbot: React.FC = () => {
    const [messages, setMessages] = useState<MessageType[]>([]);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const socket = useRef<Socket | null>(null);
    const hasReceivedInitialMessage = useRef(false); // To track if the initial message has been received

    useEffect(() => {
        console.log('Conectando al servidor...');
        socket.current = io('https://e8d0-2806-10be-c-9026-35e4-bf8e-c75b-aced.ngrok-free.app');

        socket.current.on('connect', () => {
            console.log('Conectado al servidor');
        });

        socket.current.on('respuestaBot', (response: string) => {
            if (!hasReceivedInitialMessage.current) {
                try {
                    const parsedResponse = JSON.parse(response);
                    if (parsedResponse.text && parsedResponse.options && Array.isArray(parsedResponse.options)) {
                        setMessages(prevMessages => [...prevMessages, {
                            text: parsedResponse.text,
                            sender: 'bot',
                            isInitialBotMessage: true,
                            options: parsedResponse.options,
                        }]);
                        hasReceivedInitialMessage.current = true;
                        return;
                    }
                } catch (error) {
                    // Si no es un JSON con el formato esperado, trata como un mensaje de texto normal
                }
                setMessages(prevMessages => [...prevMessages, { text: response, sender: 'bot' }]);
                hasReceivedInitialMessage.current = true;
            } else {
                setMessages(prevMessages => [...prevMessages, { text: response, sender: 'bot' }]);
            }
        });

        socket.current.on('disconnect', () => {
            console.log('Desconectado del servidor');
        });

        return () => {
            if (socket.current) {
                socket.current.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = (text: string) => {
        if (text.trim()) {
            setMessages(prevMessages => [...prevMessages, { text, sender: 'user' }]);
            if (socket.current) {
                socket.current.emit('mensajeUsuario', text);
            }
        }
    };

    const handleOptionClick = (value: string) => {
        handleSendMessage(value);
    };

    return (
        <div style={{ height: '500px', width: '400px', border: '1px solid #ccc', borderRadius: '8px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '10px', backgroundColor: '#f0f0f0', borderBottom: '1px solid #ccc' }}>
                <strong>Chatbot</strong>
            </div>
            <div ref={chatContainerRef} style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
                {messages.map((message, index) => (
                    <div key={index}>
                        <Message text={message.text} sender={message.sender} />
                        {message.isInitialBotMessage && message.options && (
                            <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                                {message.options.map((option, optionIndex) => (
                                    <button
                                        key={optionIndex}
                                        onClick={() => handleOptionClick(option.value)}
                                        style={{ padding: '8px 15px', borderRadius: '5px', border: '1px solid #ccc', cursor: 'pointer' }}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <Input onSendMessage={handleSendMessage} />
        </div>
    );
};

export default Chatbot;