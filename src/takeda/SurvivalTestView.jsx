import React, { useState, useEffect, useRef } from 'react';
import { Timer, AlertOctagon } from 'lucide-react';

export default function SurvivalTestView({ words, onComplete }) {
    // words array (e.g., 10 items)
    // Logic: 
    // 1. Show word -> 2s count down.
    // 2. User must tap "Know" within 2s to pass (in real app, user might need to pick correct answer. For now, "Self-check").
    //    Actually, user spec said: "Know/Don't Know" or "Answer Selection". Default "Self Report".
    // 3. If Mistake or Timeout -> "Failed".
    // 4. If any fail in the block -> Repeat whole failed sub-set.

    const [queue, setQueue] = useState([...words]);
    const [mistakes, setMistakes] = useState([]); // Track IDs of words failed in this current loop
    const [currentWord, setCurrentWord] = useState(null);

    const [phase, setPhase] = useState('ready'); // ready -> testing -> result -> feedback
    const [timeLeft, setTimeLeft] = useState(2.0);
    const [showAnswer, setShowAnswer] = useState(false);

    const timerRef = useRef(null);

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
        setTimeLeft(2.0);

        // Start Timer
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 0.1) {
                    clearInterval(timerRef.current);
                    handleTimeout();
                    return 0;
                }
                return prev - 0.1;
            });
        }, 100);
    };

    useEffect(() => {
        // Initial start
        if (phase === 'ready') {
            nextWord();
        }
        return () => clearInterval(timerRef.current);
    }, []);

    const handleTimeout = () => {
        setPhase('feedback');
        handleAnswer(false, true); // fail, isTimeout
    };

    const handleAnswer = (isCorrect, isTimeout = false) => {
        clearInterval(timerRef.current);

        if (isCorrect) {
            // Good flash
            // Proceed to next instantly? Or show answer briefly?
            // "Speed is Quality". Instant.
            nextWord();
        } else {
            // Failed
            // 1. Show "Failure" visual
            // 2. Add to mistakes
            setMistakes(prev => [...prev, currentWord]);

            setPhase('feedback');
            setShowAnswer(true);
            // Wait user to click "Next" or auto? 
            // Usually strict mode forces acknowledgement of wrong answer.
        }
    };

    const retry = () => {
        // Push current word back to queue? No, user spec: "If 1 mistake... repeat small set".
        // For now, let's just proceed. The "Loop" logic happens at end of block.
        nextWord();
    };

    const finishBlock = () => {
        if (mistakes.length === 0) {
            onComplete(true); // All passed
        } else {
            // Failed the block. Must retry MISTAKES.
            // User spec: "Infinite loop until perfect".
            // Reset with only mistakes.
            alert(`Survival Check Failed.\n${mistakes.length} mistakes.\nMERCY IS NOT AN OPTION.\nRESTARTING LOOP.`);
            setQueue([...mistakes]); // Retry mistakes only? Or strict Takeda means WHOLE block? 
            // "Mistaken problem including small set". Implies mistakes only or mistakes + context.
            // Let's retry mistakes only for now to ensure progress.
            setMistakes([]);
            setPhase('ready');
            nextWord();
        }
    };

    if (phase === 'feedback' && showAnswer) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-red-900/50 animate-pulse">
                <AlertOctagon className="text-red-500 w-20 h-20 mb-4" />
                <h2 className="text-4xl font-bold mb-2">FAILED</h2>
                <p className="text-xl mb-8">Too slow or incorrect.</p>

                <div className="bg-gray-800 p-6 rounded-xl w-full max-w-sm mb-8">
                    <div className="text-gray-400 text-xs uppercase text-center mb-2">ANSWER</div>
                    <div className="text-2xl font-bold text-center">{currentWord.meaning}</div>
                </div>

                <button
                    onClick={retry}
                    className="w-full py-4 bg-red-600 text-white font-bold rounded-lg uppercase tracking-widest hover:bg-red-500"
                >
                    Accept Punishment (Next)
                </button>
            </div>
        );
    }

    if (!currentWord) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
            {/* Timer Bar */}
            <div className="w-full max-w-sm h-4 bg-gray-800 rounded-full mb-10 overflow-hidden relative">
                <div
                    className={`h-full transition-all duration-100 ease-linear ${timeLeft < 0.5 ? 'bg-red-500' : 'bg-green-500'}`}
                    style={{ width: `${(timeLeft / 2.0) * 100}%` }}
                />
            </div>

            <div className="text-center mb-12">
                <h1 className="text-5xl font-black tracking-tight mb-4">{currentWord.word}</h1>
                <div className="text-gray-500 h-6">
                    {/* Pronunciation or hint? Strict mode says NO HINT usually. */}
                </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                <button
                    onClick={() => handleAnswer(false)}
                    className="h-24 bg-gray-800 border border-gray-700 rounded-xl text-red-500 font-bold text-xl active:bg-red-900/50 transition-colors"
                >
                    UNKNOWN
                </button>
                <button
                    onClick={() => handleAnswer(true)}
                    className="h-24 bg-gray-800 border border-gray-700 rounded-xl text-green-500 font-bold text-xl active:bg-green-900/50 transition-colors"
                >
                    KNOW
                </button>
            </div>
        </div>
    );
}
