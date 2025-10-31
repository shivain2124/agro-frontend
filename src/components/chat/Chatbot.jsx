import { useEffect, useRef, useState } from 'react';
import API from '../../services/api';

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text:
        "Hi! I’m your Agro Assistant. Ask me to analyze your latest soil sample or suggest crops.\nYou can also attach a photo (leaf, label, report) for analysis."
    }
  ]);

  const endRef = useRef(null);
  const dropRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  // drag & drop
  useEffect(() => {
    const el = dropRef.current;
    if (!el) return;
    const prevent = (e) => { e.preventDefault(); e.stopPropagation(); };
    const onDrop = (e) => {
      prevent(e);
      const f = e.dataTransfer.files?.[0];
      if (f && f.type.startsWith('image/')) {
        setFile(f);
        setPreview(URL.createObjectURL(f));
      }
    };
    ['dragenter','dragover','dragleave','drop'].forEach(ev => el.addEventListener(ev, prevent));
    el.addEventListener('drop', onDrop);
    return () => {
      ['dragenter','dragover','dragleave','drop'].forEach(ev => el.removeEventListener(ev, prevent));
      el.removeEventListener('drop', onDrop);
    };
  }, [open]);

  const onPickFile = (e) => {
    const f = e.target.files?.[0];
    setFile(f || null);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const send = async () => {
    const text = input.trim();
    if (!text && !file) return;
    setMessages(m => [...m, { role: 'user', text: text || (file ? '(sent a photo)' : '') }]);
    setInput('');
    setSending(true);

    try {
      let resp;
      if (file) {
        const form = new FormData();
        if (text) form.append('message', text);
        form.append('image', file);
        resp = await API.post('/chat/ask', form, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        resp = await API.post('/chat/ask', { message: text });
      }

      const reply = resp?.data?.reply || "I couldn't generate a response.";
      setMessages(m => [...m, { role: 'bot', text: reply }]);
    } catch (e) {
      // surface the exact problem to help debug
      const status = e?.response?.status;
      const detail = e?.response?.data?.reply || e?.response?.data?.message || e?.message;
      setMessages(m => [
        ...m,
        {
          role: 'bot',
          text: `Sorry, I couldn't reach the chat service.${status ? ` (HTTP ${status})` : ''}\n${detail ? `Details: ${detail}` : ''}`
        }
      ]);
      // Also log to console for dev
      // eslint-disable-next-line no-console
      console.error('Chat error:', e?.response || e);
    } finally {
      setSending(false);
      setFile(null);
      setPreview(null);
    }
  };

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!sending) send();
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-6 right-6 rounded-full shadow-lg px-5 py-4 bg-green-600 text-white hover:bg-green-700 z-40"
        title="Chat with Agro Assistant"
      >
        {open ? '✖' : '💬'}
      </button>

      {open && (
        <div
          ref={dropRef}
          className="fixed bottom-20 right-6 w-96 max-w-[92vw] h-[28rem] bg-white border rounded-lg shadow-xl flex flex-col z-40"
        >
          <div className="px-4 py-3 border-b font-semibold bg-green-50">Agro Assistant</div>

          <div className="flex-1 overflow-auto p-3 space-y-2">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] whitespace-pre-wrap ${
                  m.role === 'bot' ? 'bg-gray-100' : 'bg-green-100'
                } px-3 py-2 rounded-lg ${m.role === 'bot' ? '' : 'ml-auto'}`}
              >
                {m.text}
              </div>
            ))}

            {preview && (
              <div className="ml-auto">
                <img src={preview} alt="preview" className="max-w-[60%] rounded border" />
              </div>
            )}

            {sending && (
              <div className="bg-gray-100 px-3 py-2 rounded-lg inline-block">
                Assistant is typing…
              </div>
            )}

            <div ref={endRef} />
          </div>

          <div className="p-3 border-t flex gap-2 items-center">
            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded border">
              📎
              <input type="file" accept="image/*" onChange={onPickFile} className="hidden" />
            </label>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
              rows={1}
              placeholder="Ask something... (you can attach a photo or drag & drop)"
              className="flex-1 border rounded-md px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-green-300"
              disabled={sending}
            />
            <button
              onClick={send}
              disabled={sending}
              className={`text-white px-4 rounded-md ${sending ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
            >
              {sending ? 'Sending…' : 'Send'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
