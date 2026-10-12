import React, { useState, useEffect, useRef } from 'react';
import { FiMic } from 'react-icons/fi';

export default function VoiceText({ 
  onTranscript, 
  dark = false, 
  loading = false,
  setMessage 
}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef('');
  const isStartingRef = useRef(false);
  const isStoppingRef = useRef(false);
  const restartTimeoutRef = useRef(null);

  useEffect(() => {
   
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      return;
    }

    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';
    recognitionRef.current.maxAlternatives = 1;

    
    recognitionRef.current.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        const isFinal = event.results[i].isFinal;
        
        if (isFinal) {
          finalTranscript += transcript + ' ';
          finalTranscriptRef.current += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        setTranscript(finalTranscriptRef.current);
        
        if (setMessage) {
          setMessage(prev => {
            const accumulated = finalTranscriptRef.current.trim();
            if (prev && prev.includes(accumulated)) {
              return prev;
            }
            return prev ? `${prev} ${accumulated}` : accumulated;
          });
        }

        if (onTranscript) {
          onTranscript(finalTranscriptRef.current);
        }
      } else if (interimTranscript) {
        if (setMessage) {
          const baseMessage = finalTranscriptRef.current || '';
          if (baseMessage) {
            setMessage(`${baseMessage} ${interimTranscript}`);
          } else {
            setMessage(interimTranscript);
          }
        }
      }
    };

   
    recognitionRef.current.onerror = (event) => {
      if (event.error === 'aborted' || event.error === 'no-speech') {
        return;
      }
      
      if (event.error === 'not-allowed') {
        alert('Please allow microphone access to use voice input.');
        setIsListening(false);
      } else if (event.error === 'audio-capture') {
        setIsListening(false);
      } else {
        if (isListening && !isStoppingRef.current) {
          handleRestart();
        }
      }
    };

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      isStartingRef.current = false;
    };

    recognitionRef.current.onend = () => {
      if (isListening && !isStoppingRef.current) {
        handleRestart();
      } else {
        setIsListening(false);
        isStoppingRef.current = false;
      }
    };

    
    return () => {
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (error) {
          
        }
      }
      finalTranscriptRef.current = '';
    };
  }, []);

  const handleRestart = () => {
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
    }
    
    restartTimeoutRef.current = setTimeout(() => {
      try {
        if (isListening && recognitionRef.current && !isStoppingRef.current) {
          recognitionRef.current.start();
        }
      } catch (error) {
        if (!error.message?.includes('already started')) {
          setIsListening(false);
        }
      }
    }, 500);
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (isStartingRef.current || isListening) {
      return;
    }

    isStartingRef.current = true;
    isStoppingRef.current = false;
    finalTranscriptRef.current = '';
    setTranscript('');

    try {
      recognitionRef.current.start();
    } catch (error) {
      isStartingRef.current = false;
      
      if (error.message && error.message.includes('already started')) {
        try {
          recognitionRef.current.stop();
          setTimeout(() => {
            try {
              recognitionRef.current.start();
            } catch (restartError) {
              setIsListening(false);
              isStartingRef.current = false;
            }
          }, 300);
        } catch (stopError) {
          setIsListening(false);
          isStartingRef.current = false;
        }
      } else {
        setIsListening(false);
        isStartingRef.current = false;
      }
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current || !isListening) {
      return;
    }

    isStoppingRef.current = true;
    isStartingRef.current = false;

    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }

    try {
      recognitionRef.current.stop();
      setIsListening(false);
      isStoppingRef.current = false;
    } catch (error) {
      setIsListening(false);
      isStoppingRef.current = false;
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  
  useEffect(() => {
    if (loading && isListening) {
      stopListening();
    }
  }, [loading]);

  return (
    <button
      type="button"
      title={isListening ? "Stop recording" : "Voice input"}
      disabled={loading}
      onClick={toggleListening}
      className={`
        flex
        h-10
        w-10
        items-center
        justify-center
        rounded-xl
        transition-all
        hover:scale-105
        active:scale-95
        relative
        ${isListening ? 'animate-pulse' : ''}
        ${
          isListening
            ? dark
              ? 'text-red-400 hover:bg-white/10 hover:text-red-300'
              : 'text-red-500 hover:bg-red-50 hover:text-red-600'
            : dark
              ? 'text-gray-400 hover:bg-white/10 hover:text-white'
              : 'text-gray-500 hover:bg-gray-200 hover:text-black'
        }
      `}
    >
      <FiMic size={19} />
      
      {}
      {isListening && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
      )}
    </button>
  );
}