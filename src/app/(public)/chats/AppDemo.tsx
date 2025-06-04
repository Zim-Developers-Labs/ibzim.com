'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppScreen } from './AppScreen';

interface Message {
  id: number;
  text: string;
  sent: boolean;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
}

// Initial messages that are shown immediately
const initialMessages: Message[] = [
  {
    id: 1,
    text: "Hey! How's the new project going?",
    sent: false,
    timestamp: '10:30',
    status: 'read',
  },
  {
    id: 2,
    text: 'Going great! Just finished the UI components',
    sent: true,
    timestamp: '10:32',
    status: 'read',
  },
  {
    id: 3,
    text: 'The design looks amazing 🎨',
    sent: true,
    timestamp: '10:32',
    status: 'read',
  },
];

// Message that triggers typing indicator
const triggerMessage: Message = {
  id: 4,
  text: 'Thanks! Want to see a preview?',
  sent: false,
  timestamp: '10:35',
  status: 'read',
};

// Response to the trigger message
const responseMessage: Message = {
  id: 5,
  text: 'Send it over',
  sent: true,
  timestamp: '10:36',
  status: 'delivered',
};

// New messages that come after the typing indicator
const newMessages: Message[] = [
  {
    id: 6,
    text: "Here's the mobile app we built",
    sent: false,
    timestamp: '10:38',
    status: 'sent',
  },
  {
    id: 7,
    text: 'Wow, this looks professional! 🚀',
    sent: true,
    timestamp: '10:40',
    status: 'sent',
  },
  {
    id: 8,
    text: 'Love the animations and interactions',
    sent: true,
    timestamp: '10:40',
    status: 'sent',
  },
];

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="mb-2 flex items-center gap-2 px-3 py-2"
    >
      <div className="flex items-center gap-1 rounded-2xl bg-gray-200 px-4 py-2">
        <motion.div
          className="h-2 w-2 rounded-full bg-gray-400"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{
            duration: 0.5 + Math.random() * 0.3,
            repeat: Number.POSITIVE_INFINITY,
            delay: 0 + Math.random() * 0.1,
          }}
        />
        <motion.div
          className="h-2 w-2 rounded-full bg-gray-400"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{
            duration: 0.6 + Math.random() * 0.2,
            repeat: Number.POSITIVE_INFINITY,
            delay: 0.15 + Math.random() * 0.1,
          }}
        />
        <motion.div
          className="h-2 w-2 rounded-full bg-gray-400"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{
            duration: 0.55 + Math.random() * 0.25,
            repeat: Number.POSITIVE_INFINITY,
            delay: 0.3 + Math.random() * 0.1,
          }}
        />
      </div>
    </motion.div>
  );
}

function MessageBubble({
  message,
  index,
}: {
  message: Message;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.3,
        delay: index * 0.08 + Math.random() * 0.1, // More natural staggering
        type: 'spring',
        stiffness: 400 + Math.random() * 200, // Varying spring stiffness
        damping: 25 + Math.random() * 10,
      }}
      className={`mb-2 flex ${message.sent ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-[75%] ${message.sent ? 'order-2' : 'order-1'}`}>
        <div
          className={`rounded-2xl px-3 py-2 text-sm leading-relaxed ${
            message.sent
              ? 'rounded-br-md bg-green-500 text-white'
              : 'rounded-bl-md bg-gray-200 text-gray-800'
          }`}
        >
          {message.text}
        </div>
        <div
          className={`mt-1 flex items-center gap-1 px-1 ${message.sent ? 'justify-end' : 'justify-start'}`}
        >
          <span className="text-xs text-gray-500">{message.timestamp}</span>
          {message.sent && (
            <div className="flex">
              {message.status === 'sent' && (
                <svg
                  className="h-3 w-3 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {message.status === 'delivered' && (
                <div className="flex">
                  <svg
                    className="-mr-1 h-3 w-3 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <svg
                    className="h-3 w-3 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
              {message.status === 'read' && (
                <div className="flex">
                  <svg
                    className="-mr-1 h-3 w-3 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <svg
                    className="h-3 w-3 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function AppDemo() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [showTyping, setShowTyping] = useState(false);
  const [stage, setStage] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);

  // Manage the conversation flow
  useEffect(() => {
    let timer: NodeJS.Timeout;

    const randomDelay = (min: number, max: number) =>
      min + Math.random() * (max - min);

    switch (stage) {
      case 0: // Show trigger message
        timer = setTimeout(
          () => {
            setMessages((prev) => [...prev, triggerMessage]);
            setStage(1);
          },
          randomDelay(1000, 1500),
        );
        break;

      case 1: // Show typing indicator after trigger message
        timer = setTimeout(
          () => {
            setShowTyping(true);
            setStage(2);
          },
          randomDelay(800, 1200),
        );
        break;

      case 2: // Hide typing and show response
        timer = setTimeout(
          () => {
            setShowTyping(false);
            setMessages((prev) => [...prev, responseMessage]);
            setStage(3);
          },
          randomDelay(1800, 2500),
        );
        break;

      case 3: // Show typing again for the next message
        timer = setTimeout(
          () => {
            setShowTyping(true);
            setStage(4);
          },
          randomDelay(1500, 2000),
        );
        break;

      case 4: // Show first new message
        timer = setTimeout(
          () => {
            setShowTyping(false);
            setMessages((prev) => [...prev, newMessages[0]]);
            setStage(5);
          },
          randomDelay(1800, 2500),
        );
        break;

      case 5: // Show second new message
        timer = setTimeout(
          () => {
            setMessages((prev) => [...prev, newMessages[1]]);
            setStage(6);
          },
          randomDelay(1000, 1500),
        );
        break;

      case 6: // Show third new message
        timer = setTimeout(
          () => {
            setMessages((prev) => [...prev, newMessages[2]]);
            setStage(7);
          },
          randomDelay(800, 1200),
        );
        break;

      case 7: // Reset after a longer pause
        timer = setTimeout(
          () => {
            setMessages(initialMessages);
            setStage(0);
            setCycleCount((prev) => prev + 1);
          },
          randomDelay(8000, 12000),
        );
        break;
    }

    return () => clearTimeout(timer);
  }, [stage, cycleCount]);

  return (
    <AppScreen>
      {/* Chat Header */}
      <div className="flex items-center gap-3 bg-green-600 px-4 py-3 text-white">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300">
          <span className="text-sm font-medium text-gray-600">JS</span>
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium">John Smith</div>
          <div className="text-xs text-green-100">online</div>
        </div>
        <div className="flex gap-4">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path
              fillRule="evenodd"
              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-3">
        <AnimatePresence>
          {messages.map((message, index) => (
            <MessageBubble key={message.id} message={message} index={index} />
          ))}
          {showTyping && <TypingIndicator />}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <motion.div
        className="flex items-center gap-2 border-t border-gray-200 bg-white p-3"
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <svg
          className="h-5 w-5 text-gray-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zM9 9a1 1 0 100-2 1 1 0 000 2zm4 0a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
        <div className="flex-1 rounded-full bg-gray-100 px-4 py-2">
          <span className="text-sm text-gray-500">Type a message...</span>
        </div>
        <svg
          className="h-5 w-5 text-gray-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 12c0-2.21-.895-4.21-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 12a5.984 5.984 0 01-.757 2.829 1 1 0 11-1.415-1.414A3.987 3.987 0 0013 12a3.988 3.988 0 00-.172-1.415 1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
          <svg
            className="h-4 w-4 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </div>
      </motion.div>
    </AppScreen>
  );
}
