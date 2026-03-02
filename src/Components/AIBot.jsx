import { useEffect, useRef, useState } from "react";
import { FiMessageSquare, FiSend, FiTrash2, FiX } from "react-icons/fi";
import "../Style/AIBot.css";
import { Bot } from 'lucide-react';

const ENDPOINT = "https://rag-ai-bot-elpx.onrender.com/ai_chat/ask";
const API_KEY = "c0430c864a0cd9390e1130f155b7d25db2e32ea2a139cb4ba4693b2b1fd274f4";

function parsePayload(raw) {
    if (!raw) return null;

    if (typeof raw === "string") {
        try {
            return JSON.parse(raw);
        } catch {
            return null;
        }
    }

    if (raw.response) {
        if (typeof raw.response === "string") {
            try {
                return JSON.parse(raw.response);
            } catch {
                return null;
            }
        }

        if (typeof raw.response === "object") return raw.response;
    }

    return raw;
}

function hasItems(value) {
    return Array.isArray(value) && value.length > 0;
}

function formatTime(date = new Date()) {
    return new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    }).format(date);
}

function AssistantContent({ payload }) {
    if (!payload || typeof payload !== "object") {
        return <p className="assistant-message">Sorry, I could not understand that response.</p>;
    }

    const data = payload.data && typeof payload.data === "object" ? payload.data : {};

    return (
        <div className="assistant-content">
            {payload.topic && <p className="assistant-topic">{payload.topic}</p>}
            {payload.message && <p className="assistant-message">{payload.message}</p>}
            {data.summary && <p className="assistant-message">{data.summary}</p>}

            {hasItems(data.steps) && (
                <div className="assistant-block">
                    <h4>Steps</h4>
                    <ul>
                        {data.steps.map((item, index) => <li key={`step-${index}`}>{item}</li>)}
                    </ul>
                </div>
            )}

            {hasItems(data.notes) && (
                <div className="assistant-block">
                    <h4>Notes</h4>
                    <ul>
                        {data.notes.map((item, index) => <li key={`note-${index}`}>{item}</li>)}
                    </ul>
                </div>
            )}

            {hasItems(data.warnings) && (
                <div className="assistant-block warning">
                    <h4>Warnings</h4>
                    <ul>
                        {data.warnings.map((item, index) => <li key={`warn-${index}`}>{item}</li>)}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default function AIBot({ inSidebar = false }) {
    const [isOpen, setIsOpen] = useState(false);
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: "welcome",
            role: "assistant",
            time: formatTime(),
            payload: {
                topic: "SmartDrive Assistant",
                data: {
                    summary: "Ask me anything about SmartDrive operations and workflows."
                }
            }
        }
    ]);

    const feedRef = useRef(null);

    useEffect(() => {
        if (!feedRef.current) return;
        feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }, [messages, loading, isOpen]);

    async function askAI(e) {
        e.preventDefault();
        const cleanPrompt = prompt.trim();

        if (!cleanPrompt || loading) return;

        const userMessage = {
            id: `u-${Date.now()}`,
            role: "user",
            text: cleanPrompt,
            time: formatTime()
        };

        setMessages((prev) => [...prev, userMessage]);
        setPrompt("");
        setLoading(true);

        try {
            const response = await fetch(ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: cleanPrompt,
                    "x-api-key": API_KEY
                })
            });

            const raw = await response.json().catch(() => null);
            const parsed = parsePayload(raw);

            let payload = parsed;
            if (!payload || typeof payload !== "object") {
                payload = { message: "Invalid response format from AI service." };
            } else if (!response.ok && !payload.message) {
                payload = { ...payload, message: "Failed to fetch response from AI service." };
            }

            const assistantMessage = {
                id: `a-${Date.now()}`,
                role: "assistant",
                payload,
                time: formatTime()
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    id: `a-${Date.now()}`,
                    role: "assistant",
                    payload: { message: "Unable to connect to AI service. Please try again." },
                    time: formatTime()
                }
            ]);
        } finally {
            setLoading(false);
        }
    }

    function onInputKeyDown(e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            askAI(e);
        }
    }

    function clearChat() {
        setMessages([
            {
                id: `welcome-${Date.now()}`,
                role: "assistant",
                time: formatTime(),
                payload: {
                    topic: "SmartDrive Assistant",
                    data: {
                        summary: "Chat cleared. Ask your next question."
                    }
                }
            }
        ]);
    }

    return (
        <div className={`ai-bot-wrapper ${inSidebar ? "in-sidebar" : ""}`}>
            {isOpen && (
                <div className={`ai-chat-panel ${inSidebar ? "in-sidebar" : ""}`}>
                    <div className="ai-chat-header">
                        <div className="ai-chat-title">
                            <Bot size={28} />
                            <div>
                                <p>SmartDrive AI</p>
                                <span>Online</span>
                            </div>
                        </div>
                        <div className="ai-chat-actions">
                            <button type="button" onClick={clearChat} title="Clear chat">
                                <FiTrash2 size={16} />
                            </button>
                            <button type="button" onClick={() => setIsOpen(false)} title="Close">
                                <FiX size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="ai-chat-feed" ref={feedRef}>
                        {messages.map((message) => (
                            <div key={message.id} className={`chat-row ${message.role}`}>
                                <div className={`chat-bubble ${message.role}`}>
                                    {message.role === "user" ? (
                                        <p>{message.text}</p>
                                    ) : (
                                        <AssistantContent payload={message.payload} />
                                    )}
                                </div>
                                <span className="chat-time">{message.time}</span>
                            </div>
                        ))}

                        {loading && (
                            <div className="chat-row assistant">
                                <div className="chat-bubble assistant typing">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        )}
                    </div>

                    <form className="ai-chat-input" onSubmit={askAI}>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={onInputKeyDown}
                            rows={2}
                            placeholder="Type your Doubtful questions here..."
                        />
                        <button type="submit" disabled={loading || !prompt.trim()}>
                            <FiSend size={14} />
                        </button>
                    </form>
                </div>
            )}

            {!isOpen && (
                <button className={`ai-chat-launcher ${inSidebar ? "in-sidebar" : ""}`} onClick={() => setIsOpen(true)} type="button" aria-label="Open AI assistant">
                    <FiMessageSquare size={21} />
                </button>
            )}
        </div>
    );
}