import { useState, useRef, useEffect } from "react";
import { FaRobot, FaTimes, FaPaperPlane, FaRegCommentDots } from "react-icons/fa";
import "./Chatbot.css";

// Custom Chatbot Logo Component
const ChatbotLogo = () => (
  <div style={{
    position: 'relative',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '10px',
  }}>
    <div style={{
      position: 'absolute',
      width: '100%',
      height: '100%',
      borderRadius: '10px',
      background: '#1565C0',
      transform: 'rotate(45deg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 10px rgba(21, 101, 192, 0.4)'
    }}>
      <FaRobot style={{ color: 'white', fontSize: '18px', transform: 'rotate(-45deg)' }} />
    </div>
  </div>
);

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: `Heyyy, I'm *TrendBot* — your personal style genie from *Trend Haven*! 
Need help picking your next outfit or decoding the latest trend? Type away, fashionista!`,
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const convertMarkdownToHTML = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // **bold**
      .replace(/\*(.*?)\*/g, "<em>$1</em>") // *italic*
      .replace(/`(.*?)`/g, "<code>$1</code>"); // `code`
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { text: data.reply, sender: "bot" }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Oops! *TrendBot* tripped on a shoelace 😅. Try again in a bit!",
          sender: "bot",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    if (isOpen) {
      setMessages([
        {
          text: `Hey there! I'm *TrendBot* — your personal style assistant from *Trend Haven*! 👋\n\nI can help you with:\n• Finding the latest fashion trends\n• Outfit suggestions\n• Product recommendations\n• Answering your fashion queries\n\nWhat can I help you with today?`,
          sender: "bot",
        },
      ]);
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        className={`chatbot-button ${isOpen ? "hidden" : ""}`}
        onClick={toggleChat}
        aria-label="Chat with TrendBot"
      >
        <FaRegCommentDots className="chatbot-icon" />
      </button>

      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
          <h3>
            <ChatbotLogo />
            TrendBot Assistant
          </h3>
          <button className="close-button" onClick={toggleChat}>
            <FaTimes />
          </button>
        </div>

          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                <div className="message-content">
                  {msg.text.split("\n").map((paragraph, i) => (
                    <p
                      key={i}
                      dangerouslySetInnerHTML={{
                        __html: convertMarkdownToHTML(paragraph),
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message bot">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask TrendBot for styling advice..."
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !input.trim()}>
              <FaPaperPlane />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
