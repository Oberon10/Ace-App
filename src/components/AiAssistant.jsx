import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Sparkles, 
  X, 
  Minus, 
  Send, 
  Calculator, 
  Search, 
  Clock, 
  User, 
  Headphones, 
  Phone, 
  Mail, 
  MessageSquare, 
  ArrowRight, 
  Truck, 
  Plane, 
  Ship, 
  Train, 
  RotateCcw, 
  ExternalLink, 
  AlertCircle
} from 'lucide-react';
import { COUNTRY_LIST, getCitiesForCountry } from '../data/locations';

function TrackingPromptInput({ onSubmit, isDark }) {
  const [val, setVal] = useState('');
  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault();
        if (val.trim()) {
          onSubmit(val.trim());
          setVal('');
        }
      }}
      style={{ marginTop: '6px', display: 'flex', gap: '6px', width: '100%', maxWidth: '350px' }}
    >
      <input
        type="text"
        placeholder="Enter registered code (e.g. ACE-2T34-79011)"
        value={val}
        onChange={e => setVal(e.target.value)}
        style={{
          flex: 1,
          padding: '8px 12px',
          fontSize: '12.5px',
          borderRadius: '8px',
          border: isDark ? '1px solid #475569' : '1px solid #CBD5E1',
          outline: 'none',
          backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
          color: isDark ? '#F8FAFC' : '#0F172A'
        }}
      />
      <button
        type="submit"
        disabled={!val.trim()}
        style={{
          backgroundColor: val.trim() ? '#0B4F7C' : (isDark ? '#334155' : '#94A3B8'),
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '8px',
          padding: '0 15px',
          fontSize: '12px',
          fontWeight: 700,
          cursor: val.trim() ? 'pointer' : 'default',
          transition: 'background-color 0.2s'
        }}
      >
        <span style={{ color: '#FFFFFF' }}>Track</span>
      </button>
    </form>
  );
}

export default function AiAssistant({ 
  onSearchTracking, 
  onProceedToShipment, 
  allShipments = [], 
  currentUser = null,
  theme = 'light'
}) {
  const isDark = theme === 'dark';
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [msgSeq, setMsgSeq] = useState(2);

  // Quote State
  const [quoteState, setQuoteState] = useState({
    originCountry: 'Ghana',
    originCity: 'Accra',
    destinationCountry: 'United Kingdom',
    destinationCity: 'London',
    weight: '25',
    method: 'Air Freight Priority',
    calculated: null
  });

  // Lead State
  const [leadState, setLeadState] = useState({
    name: currentUser?.name || '',
    contact: currentUser?.email || currentUser?.phone || '',
    note: '',
    submitted: false,
    ticketId: ''
  });

  // Human Callback
  const [callbackNumber, setCallbackNumber] = useState('');
  const [callbackRequested, setCallbackRequested] = useState(false);

  // Messages List
  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Hi${currentUser?.name ? ' ' + currentUser.name : ''}! How can I help you today?`,
      type: 'welcome',
      quickActions: [
        { label: 'Get a Quote', icon: 'calculator', action: 'quote' },
        { label: 'Track Shipment', icon: 'search', action: 'track' },
        { label: 'Delivery Times', icon: 'clock', action: 'delivery' },
        { label: 'Contact Us', icon: 'user', action: 'lead' },
        { label: 'Talk to Human', icon: 'headphones', action: 'human' }
      ]
    }
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen, isMinimized]);

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setUnreadCount(0);
  };

  const nextId = () => {
    setMsgSeq(s => s + 1);
    return 'msg-' + Date.now() + '-' + msgSeq;
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: nextId(),
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: 'How can I assist you?',
        type: 'welcome',
        quickActions: [
          { label: 'Get a Quote', icon: 'calculator', action: 'quote' },
          { label: 'Track Shipment', icon: 'search', action: 'track' },
          { label: 'Delivery Times', icon: 'clock', action: 'delivery' },
          { label: 'Contact Us', icon: 'user', action: 'lead' },
          { label: 'Talk to Human', icon: 'headphones', action: 'human' }
        ]
      }
    ]);
  };

  const addBotReply = (text, options = {}) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: nextId(),
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text,
          ...options
        }
      ]);
    }, 350);
  };

  // FLOW 1: QUOTE
  const triggerQuoteFlow = () => {
    setMessages(prev => [
      ...prev,
      {
        id: nextId(),
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: 'I need a shipping quote.'
      }
    ]);

    addBotReply(
      "Choose route, weight, and mode to calculate your rate:",
      {
        type: 'quote_card',
        quickActions: [
          { label: 'Air Express', icon: 'plane', action: 'quote_air' },
          { label: 'Ocean Freight', icon: 'ship', action: 'quote_ocean' },
          { label: 'Ground Fleet', icon: 'truck', action: 'quote_ground' },
          { label: 'Rail Corridor', icon: 'train', action: 'quote_rail' }
        ]
      }
    );
  };

  const handleCalculateQuote = (overrideMethod = null) => {
    const selectedMethod = overrideMethod || quoteState.method;
    const w = parseFloat(quoteState.weight) || 10;
    let rate = 9.0;
    let days = '2–4 Business Days';

    if (selectedMethod.includes('Ocean')) {
      rate = 2.5;
      days = '14–22 Days';
    } else if (selectedMethod.includes('Ground') || selectedMethod.includes('Road')) {
      rate = 4.0;
      days = '1–3 Business Days';
    } else if (selectedMethod.includes('Rail')) {
      rate = 4.5;
      days = '4–6 Business Days';
    }

    const freight = Math.round(w * rate);
    const fuel = Math.round(freight * 0.12);
    const customs = 30;
    const total = freight + fuel + customs;

    const result = {
      method: selectedMethod,
      weight: w,
      origin: `${quoteState.originCity}, ${quoteState.originCountry}`,
      destination: `${quoteState.destinationCity}, ${quoteState.destinationCountry}`,
      freight,
      fuel,
      customs,
      total,
      estimatedDelivery: days
    };

    setQuoteState(prev => ({
      ...prev,
      method: selectedMethod,
      calculated: result
    }));

    addBotReply(
      `Estimated cost: **$${result.total} USD** for ${result.weight} kg (${result.method})`,
      {
        type: 'quote_result',
        quoteData: result
      }
    );
  };

  // FLOW 2: TRACK SHIPMENT
  // Note: Only registered tracking numbers can be queried; removed sample buttons below prompt.
  const triggerTrackingFlow = () => {
    setMessages(prev => [
      ...prev,
      {
        id: nextId(),
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: 'Check shipment status.'
      }
    ]);

    addBotReply(
      "Please enter your registered consignment tracking number (e.g. `ACE-2T34-79011`):",
      {
        type: 'tracking_prompt'
      }
    );
  };

  const handleLookupTracking = (trackingNum) => {
    const cleanNumber = (trackingNum || '').trim().toUpperCase();
    if (!cleanNumber) return;

    setMessages(prev => [
      ...prev,
      {
        id: nextId(),
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `Track ${cleanNumber}`
      }
    ]);

    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const stripped = cleanNumber.replace(/[^A-Z0-9]/g, '');
      
      // Strict matching: ONLY registered tracking numbers in allShipments
      const found = allShipments.find(s => {
        const sNum = (s.trackingNumber || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
        const sId = (s.id || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
        return sNum === stripped || sId === stripped;
      });

      if (found) {
        setMessages(prev => [
          ...prev,
          {
            id: nextId(),
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: `Shipment **${found.trackingNumber || found.id}** is **${found.status}**.`,
            type: 'tracking_result',
            shipmentData: found
          }
        ]);
      } else {
        // Unregistered / Not found
        setMessages(prev => [
          ...prev,
          {
            id: nextId(),
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: `⚠️ **Tracking number "${cleanNumber}" is not registered in our system.**\n\nOnly registered consignments can be tracked. Please verify your consignment code and re-enter, or contact our dispatch desk.`,
            type: 'tracking_not_found',
            quickActions: [
              { label: 'Try Another Number', icon: 'search', action: 'track' },
              { label: 'Talk to Human', icon: 'headphones', action: 'human' }
            ]
          }
        ]);
      }
    }, 400);
  };

  // FLOW 3: ESTIMATED DELIVERY
  const triggerDeliveryFlow = () => {
    setMessages(prev => [
      ...prev,
      {
        id: nextId(),
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: 'What are the delivery transit times?'
      }
    ]);

    const today = new Date();
    const addDays = (d) => {
      const target = new Date(today);
      target.setDate(target.getDate() + d);
      return target.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const estimates = [
      { mode: 'Air Freight', duration: '1–3 Days', arrival: addDays(3), icon: 'plane', color: '#0284C7', bg: isDark ? 'rgba(2,132,199,0.18)' : '#F0F9FF' },
      { mode: 'Ground Express', duration: '2–4 Days', arrival: addDays(4), icon: 'truck', color: '#D97706', bg: isDark ? 'rgba(217,119,6,0.18)' : '#FFFBEB' },
      { mode: 'Rail Intermodal', duration: '4–6 Days', arrival: addDays(6), icon: 'train', color: '#059669', bg: isDark ? 'rgba(5,150,105,0.18)' : '#ECFDF5' },
      { mode: 'Ocean Container', duration: '14–22 Days', arrival: addDays(18), icon: 'ship', color: '#2563EB', bg: isDark ? 'rgba(37,99,235,0.18)' : '#EFF6FF' }
    ];

    addBotReply(
      "Standard delivery timelines from dispatch:",
      {
        type: 'delivery_matrix',
        deliveryEstimates: estimates,
        quickActions: [
          { label: 'Get Quote', action: 'quote' },
          { label: 'Track Shipment', action: 'track' }
        ]
      }
    );
  };

  // FLOW 4: COLLECT INFO / LEAD
  const triggerLeadFlow = () => {
    setMessages(prev => [
      ...prev,
      {
        id: nextId(),
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: 'I want to contact sales/support.'
      }
    ]);

    addBotReply(
      "Leave your contact details and our team will reply within 30 minutes:",
      {
        type: 'lead_form'
      }
    );
  };

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    if (!leadState.name || !leadState.contact) return;

    const ticket = 'ACE-' + Math.floor(1000 + Math.random() * 9000);
    const leadRecord = {
      ...leadState,
      ticketId: ticket,
      createdAt: new Date().toISOString()
    };

    try {
      const existing = JSON.parse(localStorage.getItem('ace_customer_leads') || '[]');
      existing.unshift(leadRecord);
      localStorage.setItem('ace_customer_leads', JSON.stringify(existing));
    } catch {
      // ignore
    }

    setLeadState(prev => ({
      ...prev,
      submitted: true,
      ticketId: ticket
    }));

    addBotReply(
      `Thanks ${leadState.name}! We received your inquiry (**#${ticket}**). A specialist will contact you shortly.`,
      {
        type: 'lead_confirmation',
        ticketId: ticket,
        quickActions: [
          { label: 'Get Quote', action: 'quote' },
          { label: 'Call Hotline', action: 'call_hotline' }
        ]
      }
    );
  };

  // FLOW 5: HUMAN TRANSFER
  const triggerHumanFlow = () => {
    setMessages(prev => [
      ...prev,
      {
        id: nextId(),
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: 'Transfer to a human agent.'
      }
    ]);

    addBotReply(
      "Our operations team is available 24/7. Connect directly via:",
      {
        type: 'human_transfer',
        quickActions: [
          { label: 'Chat with Live Agent', action: 'simulate_agent_join' },
          { label: 'Call Hotline', action: 'call_hotline' }
        ]
      }
    );
  };

  const handleSimulateAgentJoin = () => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: nextId(),
          sender: 'bot',
          isHumanAgent: true,
          agentName: 'Sarah J. (Operations Dispatcher)',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `👋 **Sarah Jenkins** joined the chat: "Hello! How can I assist you with your shipment or customs clearance right now?"`,
          type: 'live_agent'
        }
      ]);
    }, 500);
  };

  const handleRequestCallback = (e) => {
    e.preventDefault();
    if (!callbackNumber) return;

    setCallbackRequested(true);
    addBotReply(
      `Callback scheduled for **${callbackNumber}**. An agent will call you in 15 minutes.`,
      { type: 'text' }
    );
  };

  // Natural Language Intent Matching
  const handleSendMessage = (e) => {
    e?.preventDefault();
    const text = inputMessage.trim();
    if (!text) return;

    const userMsg = {
      id: nextId(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text
    };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');

    const lower = text.toLowerCase();

    // Check if previous message was awaiting tracking input
    const lastBotMsg = [...messages].reverse().find(m => m.sender === 'bot');
    const isExpectingTracking = lastBotMsg?.type === 'tracking_prompt' || lastBotMsg?.type === 'tracking_not_found';

    // Tracking
    const aceMatch = text.match(/ACE[- ]?[0-9]{4}[- ]?[A-Z0-9]+/i) || text.match(/[A-Z0-9]{6,20}/i);
    if (isExpectingTracking || lower.includes('track') || lower.includes('status') || lower.includes('where is') || (aceMatch && lower.includes('ace'))) {
      if (isExpectingTracking) {
        handleLookupTracking(text);
      } else if (aceMatch) {
        const code = aceMatch[0].replace(/\s+/g, '-');
        handleLookupTracking(code);
      } else {
        triggerTrackingFlow();
      }
      return;
    }

    // Quote
    if (lower.includes('quote') || lower.includes('price') || lower.includes('cost') || lower.includes('rate') || lower.includes('how much')) {
      const weightMatch = lower.match(/(\d+(\.\d+)?)\s*(kg|kilos|lbs)?/);
      if (weightMatch) {
        setQuoteState(prev => ({ ...prev, weight: weightMatch[1] }));
      }
      triggerQuoteFlow();
      return;
    }

    // Delivery / ETA
    if (lower.includes('delivery') || lower.includes('transit') || lower.includes('how long') || lower.includes('eta') || lower.includes('time')) {
      triggerDeliveryFlow();
      return;
    }

    // Human / Call
    if (lower.includes('human') || lower.includes('agent') || lower.includes('support') || lower.includes('person') || lower.includes('call')) {
      triggerHumanFlow();
      return;
    }

    // Contact
    if (lower.includes('contact') || lower.includes('email') || lower.includes('phone') || lower.includes('message')) {
      triggerLeadFlow();
      return;
    }

    addBotReply(
      "How would you like to proceed?",
      {
        quickActions: [
          { label: 'Get a Quote', icon: 'calculator', action: 'quote' },
          { label: 'Track Shipment', icon: 'search', action: 'track' },
          { label: 'Delivery Times', icon: 'clock', action: 'delivery' },
          { label: 'Contact Us', icon: 'user', action: 'lead' },
          { label: 'Talk to Human', icon: 'headphones', action: 'human' }
        ]
      }
    );
  };

  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'calculator': return <Calculator size={13} />;
      case 'search': return <Search size={13} />;
      case 'clock': return <Clock size={13} />;
      case 'user': return <User size={13} />;
      case 'headphones': return <Headphones size={13} />;
      case 'plane': return <Plane size={13} />;
      case 'ship': return <Ship size={13} />;
      case 'truck': return <Truck size={13} />;
      case 'train': return <Train size={13} />;
      default: return <Sparkles size={13} />;
    }
  };

  return (
    <div className="ace-ai-assistant-root">
      {/* 1. FLOATING LAUNCHER */}
      {!isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '8px'
        }}>
          {/* Compact Pill */}
          <div 
            onClick={handleOpen}
            style={{
              background: isDark ? '#1E293B' : '#FFFFFF',
              color: isDark ? '#F8FAFC' : '#073B5C',
              border: isDark ? '1px solid #334155' : '1px solid #BAE6FD',
              borderRadius: '20px',
              padding: '7px 14px',
              fontSize: '12.5px',
              fontWeight: 700,
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
            <span>Need help? <strong style={{ color: '#0284C7' }}>Ask AI</strong></span>
          </div>

          {/* Launcher Button */}
          <button
            onClick={handleOpen}
            aria-label="Open AI Assistant"
            style={{
              width: '58px',
              height: '58px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #072A42 0%, #0B4F7C 50%, #0284C7 100%)',
              color: '#FFFFFF',
              border: '2px solid #FFFFFF',
              boxShadow: '0 8px 24px rgba(2, 132, 199, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            <Bot size={28} color="#FFFFFF" />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                fontSize: '10px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #FFFFFF'
              }}>
                1
              </span>
            )}
          </button>
        </div>
      )}

      {/* 2. CHAT PANEL */}
      {isOpen && (
        <div 
          className="ace-ai-panel"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 99999,
            width: 'clamp(320px, 92vw, 400px)',
            height: isMinimized ? '56px' : 'clamp(500px, 78vh, 640px)',
            maxHeight: 'calc(100vh - 36px)',
            backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
            borderRadius: '18px',
            boxShadow: '0 16px 48px rgba(7, 42, 66, 0.25)',
            border: isDark ? '1px solid #334155' : '1px solid #CBD5E1',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: 'var(--font-family, system-ui, -apple-system, sans-serif)'
          }}
        >
          {/* HEADER */}
          <div style={{
            background: 'linear-gradient(135deg, #072A42 0%, #0B4F7C 60%, #0284C7 100%)',
            color: '#FFFFFF',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
          onClick={() => isMinimized && setIsMinimized(false)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(255,255,255,0.25)'
              }}>
                <Bot size={20} color="#FFFFFF" />
              </div>
              <div>
                <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#FFFFFF' }}>ACE Assistant</div>
                <div style={{ fontSize: '11px', color: '#BAE6FD', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                  <span>Online • 24/7 Operations</span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} onClick={e => e.stopPropagation()}>
              <button onClick={handleResetChat} title="Reset" style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer', padding: '4px', opacity: 0.85 }}>
                <RotateCcw size={14} color="#FFFFFF" />
              </button>
              <button onClick={() => setIsMinimized(!isMinimized)} title={isMinimized ? 'Expand' : 'Minimize'} style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer', padding: '4px', opacity: 0.85 }}>
                <Minus size={15} color="#FFFFFF" />
              </button>
              <button onClick={() => setIsOpen(false)} title="Close" style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer', padding: '4px', opacity: 0.85 }}>
                <X size={15} color="#FFFFFF" />
              </button>
            </div>
          </div>

          {/* CHAT BODY */}
          {!isMinimized && (
            <>
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '14px',
                background: isDark ? '#090D16' : '#F8FAFC',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {messages.map((msg) => {
                  const isBot = msg.sender === 'bot';
                  return (
                    <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isBot ? 'flex-start' : 'flex-end', maxWidth: '100%' }}>
                      {/* Sender timestamp */}
                      <div style={{ fontSize: '10.5px', color: isDark ? '#94A3B8' : '#64748B', marginBottom: '3px', padding: '0 4px', fontWeight: 600 }}>
                        {isBot ? (msg.isHumanAgent ? msg.agentName : 'ACE AI') : 'You'} • {msg.timestamp}
                      </div>

                      {/* Bubble */}
                      <div 
                        className={isBot ? 'ace-ai-bot-bubble' : 'ace-ai-user-bubble'}
                        style={{
                          background: isBot 
                            ? (msg.isHumanAgent 
                                ? (isDark ? '#78350F' : '#FEF3C7') 
                                : (isDark ? '#1E293B' : '#FFFFFF')) 
                            : '#0B4F7C',
                          color: isBot 
                            ? (msg.isHumanAgent 
                                ? (isDark ? '#FEF3C7' : '#78350F') 
                                : (isDark ? '#F8FAFC' : '#0F172A')) 
                            : '#FFFFFF',
                          border: isBot 
                            ? (msg.isHumanAgent 
                                ? (isDark ? '1px solid #D97706' : '1px solid #FCD34D') 
                                : (isDark ? '1px solid #334155' : '1px solid #E2E8F0')) 
                            : 'none',
                          borderRadius: isBot ? '4px 14px 14px 14px' : '14px 14px 4px 14px',
                          padding: '10px 14px',
                          fontSize: '13px',
                          lineHeight: 1.5,
                          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                          maxWidth: '92%'
                        }}
                      >
                        {msg.text.split('\n\n').map((para, pIdx) => (
                          <p key={pIdx} style={{ margin: pIdx > 0 ? '6px 0 0' : 0, color: 'inherit' }}>
                            {para.split(/(\*\*.*?\*\*|`.*?`)/).map((part, partIdx) => {
                              if (part.startsWith('**') && part.endsWith('**')) {
                                return <strong key={partIdx} style={{ color: 'inherit', fontWeight: 800 }}>{part.slice(2, -2)}</strong>;
                              }
                              if (part.startsWith('`') && part.endsWith('`')) {
                                return (
                                  <code key={partIdx} style={{
                                    backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                                    color: 'inherit',
                                    padding: '1px 5px',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    fontFamily: 'monospace'
                                  }}>
                                    {part.slice(1, -1)}
                                  </code>
                                );
                              }
                              return part;
                            })}
                          </p>
                        ))}
                      </div>

                      {/* 1. QUOTE CARD (CONCISE & HIGH-CONTRAST) */}
                      {msg.type === 'quote_card' && (
                        <div style={{
                          marginTop: '8px',
                          backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                          border: isDark ? '1px solid #334155' : '1px solid #BAE6FD',
                          borderRadius: '12px',
                          padding: '12px',
                          width: '100%',
                          maxWidth: '350px'
                        }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                            <div>
                              <label style={{ fontSize: '10.5px', color: isDark ? '#CBD5E1' : '#475569', fontWeight: 700 }}>Origin</label>
                              <select 
                                value={quoteState.originCountry}
                                onChange={(e) => {
                                  const c = e.target.value;
                                  const cities = getCitiesForCountry(c);
                                  setQuoteState(prev => ({ ...prev, originCountry: c, originCity: cities[0] || 'Accra' }));
                                }}
                                style={{
                                  width: '100%',
                                  padding: '4px 6px',
                                  fontSize: '11.5px',
                                  borderRadius: '6px',
                                  border: isDark ? '1px solid #475569' : '1px solid #CBD5E1',
                                  backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
                                  color: isDark ? '#F8FAFC' : '#0F172A'
                                }}
                              >
                                {COUNTRY_LIST.map(c => <option key={'q-org-' + c} value={c} style={{ backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#F8FAFC' : '#0F172A' }}>{c}</option>)}
                              </select>
                            </div>
                            <div>
                              <label style={{ fontSize: '10.5px', color: isDark ? '#CBD5E1' : '#475569', fontWeight: 700 }}>Destination</label>
                              <select 
                                value={quoteState.destinationCountry}
                                onChange={(e) => {
                                  const c = e.target.value;
                                  const cities = getCitiesForCountry(c);
                                  setQuoteState(prev => ({ ...prev, destinationCountry: c, destinationCity: cities[0] || 'London' }));
                                }}
                                style={{
                                  width: '100%',
                                  padding: '4px 6px',
                                  fontSize: '11.5px',
                                  borderRadius: '6px',
                                  border: isDark ? '1px solid #475569' : '1px solid #CBD5E1',
                                  backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
                                  color: isDark ? '#F8FAFC' : '#0F172A'
                                }}
                              >
                                {COUNTRY_LIST.map(c => <option key={'q-dst-' + c} value={c} style={{ backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#F8FAFC' : '#0F172A' }}>{c}</option>)}
                              </select>
                            </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: '8px', marginBottom: '8px' }}>
                            <div>
                              <label style={{ fontSize: '10.5px', color: isDark ? '#CBD5E1' : '#475569', fontWeight: 700 }}>Weight (kg)</label>
                              <input 
                                type="number" 
                                value={quoteState.weight}
                                onChange={e => setQuoteState(prev => ({ ...prev, weight: e.target.value }))}
                                style={{
                                  width: '100%',
                                  padding: '4px 8px',
                                  fontSize: '12px',
                                  borderRadius: '6px',
                                  border: isDark ? '1px solid #475569' : '1px solid #CBD5E1',
                                  backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
                                  color: isDark ? '#F8FAFC' : '#0F172A'
                                }}
                              />
                            </div>
                            <div>
                              <label style={{ fontSize: '10.5px', color: isDark ? '#CBD5E1' : '#475569', fontWeight: 700 }}>Method</label>
                              <select 
                                value={quoteState.method}
                                onChange={e => setQuoteState(prev => ({ ...prev, method: e.target.value }))}
                                style={{
                                  width: '100%',
                                  padding: '4px 6px',
                                  fontSize: '11.5px',
                                  borderRadius: '6px',
                                  border: isDark ? '1px solid #475569' : '1px solid #CBD5E1',
                                  backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
                                  color: isDark ? '#F8FAFC' : '#0F172A'
                                }}
                              >
                                <option value="Air Freight Priority" style={{ backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#F8FAFC' : '#0F172A' }}>Air (Fastest)</option>
                                <option value="Ocean Container Freight" style={{ backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#F8FAFC' : '#0F172A' }}>Ocean (Economy)</option>
                                <option value="Ground Express Fleet" style={{ backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#F8FAFC' : '#0F172A' }}>Ground / Road</option>
                                <option value="Rail Intermodal Express" style={{ backgroundColor: isDark ? '#0F172A' : '#FFFFFF', color: isDark ? '#F8FAFC' : '#0F172A' }}>Rail Freight</option>
                              </select>
                            </div>
                          </div>

                          <button
                            onClick={() => handleCalculateQuote()}
                            style={{
                              width: '100%',
                              backgroundColor: '#0284C7',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '8px',
                              fontSize: '12.5px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px'
                            }}
                          >
                            <Calculator size={14} color="#FFFFFF" /> 
                            <span style={{ color: '#FFFFFF' }}>Calculate Quote</span>
                          </button>
                        </div>
                      )}

                      {/* QUOTE RESULT (CONCISE) */}
                      {msg.type === 'quote_result' && msg.quoteData && (
                        <div style={{
                          marginTop: '8px',
                          backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                          border: isDark ? '1.5px solid #0284C7' : '1.5px solid #BAE6FD',
                          borderRadius: '12px',
                          padding: '12px',
                          width: '100%',
                          maxWidth: '350px'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                            <div style={{ fontSize: '22px', fontWeight: 800, color: isDark ? '#38BDF8' : '#073B5C' }}>
                              ${msg.quoteData.total} <span style={{ fontSize: '12px', fontWeight: 600, color: isDark ? '#94A3B8' : '#64748B' }}>USD</span>
                            </div>
                            <span style={{
                              fontSize: '11px',
                              color: '#10B981',
                              fontWeight: 700,
                              backgroundColor: isDark ? 'rgba(16,185,129,0.18)' : '#ECFDF5',
                              padding: '2px 8px',
                              borderRadius: '10px'
                            }}>
                              {msg.quoteData.estimatedDelivery}
                            </span>
                          </div>

                          <div style={{ fontSize: '11.5px', color: isDark ? '#CBD5E1' : '#475569', marginBottom: '10px', lineHeight: 1.4 }}>
                            <div>{msg.quoteData.origin} → {msg.quoteData.destination}</div>
                            <div>Tier: <strong>{msg.quoteData.method}</strong> • {msg.quoteData.weight} kg</div>
                          </div>

                          <button
                            onClick={() => {
                              if (onProceedToShipment) {
                                onProceedToShipment({
                                  weight: msg.quoteData.weight,
                                  method: msg.quoteData.method,
                                  origin: msg.quoteData.origin,
                                  destination: msg.quoteData.destination
                                });
                                setIsOpen(false);
                              }
                            }}
                            style={{
                              width: '100%',
                              backgroundColor: '#0B4F7C',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '8px',
                              fontSize: '12.5px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px'
                            }}
                          >
                            <span style={{ color: '#FFFFFF' }}>Book This Shipment</span>
                            <ArrowRight size={14} color="#FFFFFF" />
                          </button>
                        </div>
                      )}

                      {/* 2. TRACKING PROMPT (NO SAMPLE BUTTONS BELOW - ONLY REGISTERED INPUT) */}
                      {msg.type === 'tracking_prompt' && (
                        <TrackingPromptInput 
                          onSubmit={handleLookupTracking} 
                          isDark={isDark} 
                        />
                      )}

                      {/* TRACKING RESULT (FOUND - REGISTERED) */}
                      {msg.type === 'tracking_result' && msg.shipmentData && (
                        <div style={{
                          marginTop: '8px',
                          backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                          border: isDark ? '1px solid #334155' : '1px solid #BAE6FD',
                          borderRadius: '12px',
                          padding: '12px',
                          width: '100%',
                          maxWidth: '350px'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <strong style={{ fontSize: '13.5px', color: isDark ? '#38BDF8' : '#073B5C', letterSpacing: '0.3px' }}>
                              {msg.shipmentData.trackingNumber || msg.shipmentData.id}
                            </strong>
                            <span style={{
                              fontSize: '11px',
                              fontWeight: 800,
                              padding: '2px 8px',
                              borderRadius: '8px',
                              backgroundColor: msg.shipmentData.status === 'DELIVERED' 
                                ? (isDark ? 'rgba(16,185,129,0.2)' : '#ECFDF5') 
                                : msg.shipmentData.status === 'IN TRANSIT' 
                                ? (isDark ? 'rgba(2,132,199,0.2)' : '#E0F2FE') 
                                : (isDark ? 'rgba(245,158,11,0.2)' : '#FFFBEB'),
                              color: msg.shipmentData.status === 'DELIVERED' 
                                ? '#10B981' 
                                : msg.shipmentData.status === 'IN TRANSIT' 
                                ? '#38BDF8' 
                                : '#F59E0B'
                            }}>
                              {msg.shipmentData.status}
                            </span>
                          </div>

                          <div style={{ fontSize: '12px', color: isDark ? '#CBD5E1' : '#475569', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '10px' }}>
                            <div>Route: <strong style={{ color: isDark ? '#F8FAFC' : '#0F172A' }}>{msg.shipmentData.origin} → {msg.shipmentData.destination}</strong></div>
                            <div>Location: <strong style={{ color: isDark ? '#F8FAFC' : '#0F172A' }}>{msg.shipmentData.currentLocation || 'In Transit'}</strong></div>
                            <div>Delivery ETA: <strong style={{ color: isDark ? '#F8FAFC' : '#0F172A' }}>{msg.shipmentData.estimatedDelivery}</strong></div>
                          </div>

                          <button
                            onClick={() => {
                              if (onSearchTracking) {
                                onSearchTracking(msg.shipmentData.trackingNumber || msg.shipmentData.id);
                                setIsOpen(false);
                              }
                            }}
                            style={{
                              width: '100%',
                              backgroundColor: '#0284C7',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '8px',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '5px'
                            }}
                          >
                            <span style={{ color: '#FFFFFF' }}>Open Tracking Page</span>
                            <ExternalLink size={12} color="#FFFFFF" />
                          </button>
                        </div>
                      )}

                      {/* TRACKING NOT FOUND / UNREGISTERED ALERT */}
                      {msg.type === 'tracking_not_found' && (
                        <div style={{
                          marginTop: '8px',
                          backgroundColor: isDark ? 'rgba(239, 68, 68, 0.12)' : '#FEF2F2',
                          border: isDark ? '1px solid rgba(239, 68, 68, 0.35)' : '1px solid #FECACA',
                          borderRadius: '10px',
                          padding: '10px 12px',
                          width: '100%',
                          maxWidth: '350px'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '6px' }}>
                            <AlertCircle size={15} color="#EF4444" />
                            <span style={{ fontSize: '12.5px', fontWeight: 800, color: isDark ? '#FCA5A5' : '#991B1B' }}>
                              Unregistered Consignment
                            </span>
                          </div>
                          <div style={{ fontSize: '11.5px', color: isDark ? '#CBD5E1' : '#475569', lineHeight: 1.4, marginBottom: '8px' }}>
                            Only registered tracking numbers can be inputted. Re-enter a valid code below or contact our dispatch team:
                          </div>
                          <TrackingPromptInput 
                            onSubmit={handleLookupTracking} 
                            isDark={isDark} 
                          />
                        </div>
                      )}

                      {/* 3. DELIVERY MATRIX (CONCISE) */}
                      {msg.type === 'delivery_matrix' && msg.deliveryEstimates && (
                        <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', maxWidth: '350px' }}>
                          {msg.deliveryEstimates.map((est, eIdx) => (
                            <div key={eIdx} style={{
                              backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                              border: isDark ? '1px solid #334155' : '1px solid #E2E8F0',
                              borderRadius: '8px',
                              padding: '8px 12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ color: est.color }}>{renderIcon(est.icon)}</span>
                                <span style={{ fontSize: '12px', fontWeight: 700, color: isDark ? '#F8FAFC' : '#0F172A' }}>{est.mode}</span>
                              </div>
                              <span style={{ fontSize: '11.5px', fontWeight: 700, color: est.color, backgroundColor: est.bg, padding: '2px 8px', borderRadius: '10px' }}>
                                {est.duration} ({est.arrival})
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* 4. LEAD / CONTACT FORM (CONCISE) */}
                      {msg.type === 'lead_form' && !leadState.submitted && (
                        <form onSubmit={handleLeadSubmit} style={{
                          marginTop: '8px',
                          backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                          border: isDark ? '1px solid #334155' : '1px solid #BAE6FD',
                          borderRadius: '12px',
                          padding: '12px',
                          width: '100%',
                          maxWidth: '350px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px'
                        }}>
                          <div>
                            <label style={{ fontSize: '10.5px', color: isDark ? '#CBD5E1' : '#475569', fontWeight: 700 }}>Your Name *</label>
                            <input
                              type="text"
                              required
                              placeholder="Kwame Mensah"
                              value={leadState.name}
                              onChange={e => setLeadState(prev => ({ ...prev, name: e.target.value }))}
                              style={{
                                width: '100%',
                                padding: '6px 8px',
                                fontSize: '12px',
                                borderRadius: '6px',
                                border: isDark ? '1px solid #475569' : '1px solid #CBD5E1',
                                backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
                                color: isDark ? '#F8FAFC' : '#0F172A',
                                outline: 'none'
                              }}
                            />
                          </div>

                          <div>
                            <label style={{ fontSize: '10.5px', color: isDark ? '#CBD5E1' : '#475569', fontWeight: 700 }}>Email or Phone *</label>
                            <input
                              type="text"
                              required
                              placeholder="kwame@example.com or +233..."
                              value={leadState.contact}
                              onChange={e => setLeadState(prev => ({ ...prev, contact: e.target.value }))}
                              style={{
                                width: '100%',
                                padding: '6px 8px',
                                fontSize: '12px',
                                borderRadius: '6px',
                                border: isDark ? '1px solid #475569' : '1px solid #CBD5E1',
                                backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
                                color: isDark ? '#F8FAFC' : '#0F172A',
                                outline: 'none'
                              }}
                            />
                          </div>

                          <div>
                            <label style={{ fontSize: '10.5px', color: isDark ? '#CBD5E1' : '#475569', fontWeight: 700 }}>Message / Cargo note</label>
                            <input
                              type="text"
                              placeholder="Optional cargo description"
                              value={leadState.note}
                              onChange={e => setLeadState(prev => ({ ...prev, note: e.target.value }))}
                              style={{
                                width: '100%',
                                padding: '6px 8px',
                                fontSize: '12px',
                                borderRadius: '6px',
                                border: isDark ? '1px solid #475569' : '1px solid #CBD5E1',
                                backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
                                color: isDark ? '#F8FAFC' : '#0F172A',
                                outline: 'none'
                              }}
                            />
                          </div>

                          <button
                            type="submit"
                            style={{
                              backgroundColor: '#0B4F7C',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '8px',
                              fontSize: '12.5px',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            <span style={{ color: '#FFFFFF' }}>Submit Inquiry</span>
                          </button>
                        </form>
                      )}

                      {/* 5. HUMAN TRANSFER (CONCISE) */}
                      {msg.type === 'human_transfer' && (
                        <div style={{
                          marginTop: '8px',
                          backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                          border: isDark ? '1px solid #334155' : '1px solid #BAE6FD',
                          borderRadius: '12px',
                          padding: '12px',
                          width: '100%',
                          maxWidth: '350px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px'
                        }}>
                          <a href="tel:+233245550192" style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 10px',
                            borderRadius: '8px',
                            backgroundColor: isDark ? 'rgba(16,185,129,0.15)' : '#F0FDF4',
                            color: '#10B981',
                            textDecoration: 'none',
                            fontSize: '12px',
                            fontWeight: 700
                          }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Phone size={13} /> Call Desk: +233 24 555 0192
                            </span>
                            <ExternalLink size={12} />
                          </a>

                          <a href="https://wa.me/233245550192?text=Hello%20ACE%20Logistics" target="_blank" rel="noreferrer" style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 10px',
                            borderRadius: '8px',
                            backgroundColor: isDark ? 'rgba(5,150,105,0.15)' : '#ECFDF5',
                            color: '#059669',
                            textDecoration: 'none',
                            fontSize: '12px',
                            fontWeight: 700
                          }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <MessageSquare size={13} /> WhatsApp Dispatch
                            </span>
                            <ExternalLink size={12} />
                          </a>

                          <a href="mailto:dispatch@acelogistics.com" style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 10px',
                            borderRadius: '8px',
                            backgroundColor: isDark ? 'rgba(37,99,235,0.15)' : '#EFF6FF',
                            color: '#38BDF8',
                            textDecoration: 'none',
                            fontSize: '12px',
                            fontWeight: 700
                          }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Mail size={13} /> dispatch@acelogistics.com
                            </span>
                            <ExternalLink size={12} />
                          </a>

                          {!callbackRequested ? (
                            <form onSubmit={handleRequestCallback} style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                              <input
                                type="tel"
                                placeholder="Request phone callback"
                                value={callbackNumber}
                                onChange={e => setCallbackNumber(e.target.value)}
                                required
                                style={{
                                  flex: 1,
                                  padding: '5px 8px',
                                  fontSize: '11.5px',
                                  borderRadius: '6px',
                                  border: isDark ? '1px solid #475569' : '1px solid #CBD5E1',
                                  backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
                                  color: isDark ? '#F8FAFC' : '#0F172A',
                                  outline: 'none'
                                }}
                              />
                              <button type="submit" style={{ backgroundColor: '#0B4F7C', color: '#FFFFFF', border: 'none', borderRadius: '6px', padding: '0 10px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
                                <span style={{ color: '#FFFFFF' }}>Request</span>
                              </button>
                            </form>
                          ) : (
                            <div style={{ fontSize: '11px', color: '#10B981', fontWeight: 700, textAlign: 'center', padding: '4px' }}>
                              ✓ Callback confirmed for {callbackNumber}.
                            </div>
                          )}
                        </div>
                      )}

                      {/* QUICK ACTION BUTTONS */}
                      {msg.quickActions && msg.quickActions.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '6px' }}>
                          {msg.quickActions.map((qa, qaIdx) => (
                            <button
                              key={qaIdx}
                              onClick={() => {
                                if (qa.action === 'quote_air') {
                                  handleCalculateQuote('Air Freight Priority');
                                } else if (qa.action === 'quote_ocean') {
                                  handleCalculateQuote('Ocean Container Freight');
                                } else if (qa.action === 'quote_ground') {
                                  handleCalculateQuote('Ground Express Fleet');
                                } else if (qa.action === 'quote_rail') {
                                  handleCalculateQuote('Rail Intermodal Express');
                                } else if (qa.action === 'simulate_agent_join') {
                                  handleSimulateAgentJoin();
                                } else if (qa.action === 'call_hotline') {
                                  window.location.href = 'tel:+233245550192';
                                } else {
                                  if (qa.action === 'quote') triggerQuoteFlow();
                                  else if (qa.action === 'track') triggerTrackingFlow();
                                  else if (qa.action === 'delivery') triggerDeliveryFlow();
                                  else if (qa.action === 'lead') triggerLeadFlow();
                                  else if (qa.action === 'human') triggerHumanFlow();
                                }
                              }}
                              style={{
                                backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                                color: isDark ? '#F8FAFC' : '#073B5C',
                                border: isDark ? '1px solid #475569' : '1px solid #BAE6FD',
                                borderRadius: '14px',
                                padding: '4px 10px',
                                fontSize: '11.5px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                              }}
                            >
                              <span style={{ color: '#0284C7' }}>
                                {renderIcon(qa.icon || (qa.action === 'quote' ? 'calculator' : qa.action === 'track' ? 'search' : qa.action === 'delivery' ? 'clock' : qa.action === 'lead' ? 'user' : 'headphones'))}
                              </span>
                              <span>{qa.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Typing Indicator */}
                {isTyping && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 8px' }}>
                    <Bot size={13} color="#0284C7" />
                    <div style={{ display: 'flex', gap: '3px' }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#0284C7' }} />
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#0284C7' }} />
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#0284C7' }} />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* QUICK CHIP BAR */}
              <div style={{
                padding: '6px 12px',
                backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
                borderTop: isDark ? '1px solid #334155' : '1px solid #E2E8F0',
                display: 'flex',
                gap: '6px',
                overflowX: 'auto',
                scrollbarWidth: 'none'
              }}>
                <button onClick={triggerQuoteFlow} style={{ flexShrink: 0, padding: '4px 8px', fontSize: '11px', fontWeight: 700, borderRadius: '12px', backgroundColor: isDark ? '#1E293B' : '#F0F9FF', color: isDark ? '#38BDF8' : '#0369A1', border: isDark ? '1px solid #334155' : '1px solid #BAE6FD', cursor: 'pointer' }}>
                  Quote
                </button>
                <button onClick={triggerTrackingFlow} style={{ flexShrink: 0, padding: '4px 8px', fontSize: '11px', fontWeight: 700, borderRadius: '12px', backgroundColor: isDark ? '#1E293B' : '#F0F9FF', color: isDark ? '#38BDF8' : '#0369A1', border: isDark ? '1px solid #334155' : '1px solid #BAE6FD', cursor: 'pointer' }}>
                  Track
                </button>
                <button onClick={triggerDeliveryFlow} style={{ flexShrink: 0, padding: '4px 8px', fontSize: '11px', fontWeight: 700, borderRadius: '12px', backgroundColor: isDark ? '#1E293B' : '#F0F9FF', color: isDark ? '#38BDF8' : '#0369A1', border: isDark ? '1px solid #334155' : '1px solid #BAE6FD', cursor: 'pointer' }}>
                  ETAs
                </button>
                <button onClick={triggerLeadFlow} style={{ flexShrink: 0, padding: '4px 8px', fontSize: '11px', fontWeight: 700, borderRadius: '12px', backgroundColor: isDark ? '#1E293B' : '#F0F9FF', color: isDark ? '#38BDF8' : '#0369A1', border: isDark ? '1px solid #334155' : '1px solid #BAE6FD', cursor: 'pointer' }}>
                  Contact
                </button>
                <button onClick={triggerHumanFlow} style={{ flexShrink: 0, padding: '4px 8px', fontSize: '11px', fontWeight: 700, borderRadius: '12px', backgroundColor: isDark ? '#78350F' : '#FFFBEB', color: isDark ? '#FCD34D' : '#92400E', border: isDark ? '1px solid #B45309' : '1px solid #FDE68A', cursor: 'pointer' }}>
                  Human
                </button>
              </div>

              {/* INPUT BAR */}
              <form onSubmit={handleSendMessage} style={{
                padding: '10px 12px',
                backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
                borderTop: isDark ? '1px solid #334155' : '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <input
                  type="text"
                  placeholder="Type a message or tracking number..."
                  value={inputMessage}
                  onChange={e => setInputMessage(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    fontSize: '13px',
                    borderRadius: '20px',
                    border: isDark ? '1px solid #475569' : '1px solid #CBD5E1',
                    outline: 'none',
                    backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
                    color: isDark ? '#F8FAFC' : '#0F172A'
                  }}
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  aria-label="Send"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: inputMessage.trim() ? '#0B4F7C' : (isDark ? '#334155' : '#CBD5E1'),
                    color: '#FFFFFF',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: inputMessage.trim() ? 'pointer' : 'default'
                  }}
                >
                  <Send size={15} color="#FFFFFF" />
                </button>
              </form>
            </>
          )}
        </div>
      )}

      {/* Force explicit high-contrast rules to override global CSS conflicts */}
      <style>{`
        .ace-ai-assistant-root, .ace-ai-assistant-root * {
          box-sizing: border-box;
          word-break: break-word;
        }
        .ace-ai-panel {
          color-scheme: ${isDark ? 'dark' : 'light'};
        }
        .ace-ai-user-bubble,
        .ace-ai-user-bubble p, 
        .ace-ai-user-bubble strong, 
        .ace-ai-user-bubble span,
        .ace-ai-user-bubble code {
          color: #FFFFFF !important;
        }
        .ace-ai-bot-bubble p {
          color: ${isDark ? '#F8FAFC !important' : '#0F172A !important'};
        }
        .ace-ai-bot-bubble strong {
          color: ${isDark ? '#38BDF8 !important' : '#073B5C !important'};
        }
        .ace-ai-bot-bubble code {
          color: ${isDark ? '#38BDF8 !important' : '#0B4F7C !important'};
        }
        .ace-ai-assistant-root input,
        .ace-ai-assistant-root select {
          color: ${isDark ? '#F8FAFC !important' : '#0F172A !important'};
          background-color: ${isDark ? '#1E293B !important' : '#FFFFFF !important'};
        }
        .ace-ai-assistant-root input::placeholder {
          color: ${isDark ? '#94A3B8 !important' : '#64748B !important'};
        }
        .ace-ai-assistant-root label {
          color: ${isDark ? '#CBD5E1 !important' : '#334155 !important'};
        }
      `}</style>
    </div>
  );
}
