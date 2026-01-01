import React, { useState, useEffect, useRef } from 'react';
import { Timer, AlertOctagon, RotateCcw } from 'lucide-react';

export default function SurvivalTestView({ words, onComplete }) {
    // Logic: 
    // 1. Show word -> 2s count down.
    // 2. Mistake/Timeout -> Add to "Next Loop Queue".
    // 3. End of queue -> If "Next Loop Queue" has items -> Restart with that queue (Loop).
    // 4. If empty -> Complete.

    const [queue, setQueue] = useState([...words]);
    const [nextLoopQueue, setNextLoopQueue] = useState([]);
    const [currentWord, setCurrentWord] = useState(null);

    const [phase, setPhase] = useState('ready'); // ready -> testing -> feedback -> loop_transition
    const [timeLeft, setTimeLeft] = useState(2.0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [feedbackType, setFeedbackType] = useState(null); // 'success', 'error', 'timeout'

    const timerRef = useRef(null);
    const containerRef = useRef(null);

    // Start next word
    const nextWord = () => {
        if (queue.length === 0) {
            finishBlock();
            return;
        }
        const word = queue[0];
        setCurrentWord(word);
        setQueue(prev => prev.slice(1));
        setPhase('testing');
        setShowAnswer(false);
        setFeedbackType(null);
        setTimeLeft(2.0);

        // Start Timer
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 0.05) {
                    clearInterval(timerRef.current);
                    handleTimeout();
                    return 0;
                }
                return prev - 0.05; // 50ms interval for smoother bar
            });
        }, 50);
    };

    useEffect(() => {
        if (phase === 'ready') {
            nextWord();
        }
        return () => clearInterval(timerRef.current);
    }, []);

    const handleTimeout = () => {
        setPhase('feedback');
        setFeedbackType('timeout');
        handleAnswer(false, true);
    };

    const handleAnswer = (isCorrect, isTimeout = false) => {
        clearInterval(timerRef.current);

        if (isCorrect) {
            setFeedbackType('success');
            // Visual Feedback: Green Flash
            // Instant transition
            setTimeout(() => {
                nextWord();
            }, 300); // Short delay to see green
        } else {
            setFeedbackType('error');
            setNextLoopQueue(prev => [...prev, currentWord]);
            setPhase('feedback');
            setShowAnswer(true);
            // Wait user to acknowledge
        }
    };

    const retry = () => {
        nextWord(); // Move to next in queue
    };

    const finishBlock = () => {
        if (nextLoopQueue.length === 0) {
            onComplete(true); // All passed
        } else {
            // Loop Restart
            setPhase('loop_transition');
            setTimeout(() => {
                setQueue([...nextLoopQueue]);
                setNextLoopQueue([]); // Reset for new loop
                setPhase('ready');
                nextWord();
            }, 1500); // Show "Loop Restarting" briefly
        }
    };

    if (phase === 'loop_transition') {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-red-950 text-red-500 animate-pulse">
                <RotateCcw className="w-20 h-20 mb-4 animate-spin" />
                <h2 className="text-3xl font-black uppercase">Survival Failed</h2>
                <p className="font-mono mt-2">Restarting Loop...</p>
            </div>
        );
    }

    if (phase === 'feedback' && showAnswer) {
        return (
            <div className={`flex-1 flex flex-col items-center justify-center p-8 ${feedbackType === 'timeout' ? 'bg-gray-900' : 'bg-red-900/30'} animate-in fade-in zoom-in duration-200`}>
                <div className="animate-shake">
                    <AlertOctagon className="text-red-500 w-20 h-20 mb-4 mx-auto" />
                    <h2 className="text-4xl font-bold mb-2 text-center text-red-500">{feedbackType === 'timeout' ? 'TIME\'S UP' : 'FAILED'}</h2>
                    <p className="text-xl mb-8 text-center text-gray-400">Survival check failed.</p>
                </div>

                <div className="bg-gray-800 p-8 rounded-xl w-full max-w-sm mb-8 border border-red-900/50">
                    <div className="text-gray-500 text-xs uppercase text-center mb-2 tracking-widest">ANSWER</div>
                    <div className="text-3xl font-bold text-center text-white">{currentWord.meaning}</div>
                </div>

                <button
                    onClick={retry}
                    className="w-full py-4 bg-red-600 text-white font-bold rounded-lg uppercase tracking-widest hover:bg-red-500 shadow-lg shadow-red-900/50"
                >
                    NEXT
                </button>
            </div>
        );
    }

    if (!currentWord) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div
            className={`flex-1 flex flex-col items-center justify-center p-4 transition-colors duration-100 ${feedbackType === 'success' ? 'bg-green-900/20' : ''}`}
            ref={containerRef}
        >
            {/* Timer Bar */}
            <div className="w-full max-w-sm h-3 bg-gray-800 rounded-full mb-12 overflow-hidden relative">
                <div
                    className={`h-full transition-all duration-75 ease-linear ${timeLeft < 0.5 ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-green-500'}`}
                    style={{ width: `${(timeLeft / 2.0) * 100}%` }}
                />
            </div>

            <div className="text-center mb-16 relative">
                <h1 className="text-5xl font-black tracking-tight mb-6">{currentWord.word}</h1>

                {/* Visual Flash Element */}
                {feedbackType === 'success' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-6xl text-green-500 font-black animate-ping opacity-50">GOOD</span>
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                <button
                    onClick={() => handleAnswer(false)}
                    className="h-32 bg-gray-900 border border-gray-800 rounded-2xl text-red-500 font-black text-xl active:bg-red-900/50 active:scale-95 transition-all hover:bg-red-900/10"
                >
                    UNKNOWN
                </button>
                <button
                    onClick={() => handleAnswer(true)}
                    className="h-32 bg-gray-900 border border-gray-800 rounded-2xl text-green-500 font-black text-xl active:bg-green-900/50 active:scale-95 transition-all hover:bg-green-900/10"
                >
                    KNOW
                </button>
            </div>

            <style>{`
         @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
         }
         .animate-shake {
            animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
         }
       `}</style>
        </div>
    );
}
