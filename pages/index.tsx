import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m your Construction Estimator Assistant. What state is the job in?' }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [...messages, userMessage] })
    });

    const data = await response.json();
    setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Construction Estimate Assistant</h1>
      <div style={{ border: '1px solid #ccc', padding: '1rem', height: '400px', overflowY: 'scroll' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: '1rem' }}>
            <strong>{msg.role === 'user' ? 'You' : 'Estimator'}:</strong> {msg.content}
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>
      <div style={{ marginTop: '1rem' }}>
        <input
          style={{ width: '80%' }}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
