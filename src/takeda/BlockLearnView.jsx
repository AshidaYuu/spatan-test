import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, FastForward, RotateCcw } from 'lucide-react';

// Audio Logic (Same as App.jsx roughly)
const playAudio = (text, datasetId = 'target1900') => {
    // For prototype, we use TTS since we don't have file mapping guarantees or files might be missing.
    // Ideally use real files if available. Takeda app specs say "High Quality", so let's try file then TTS.
    // For this prototype Step: Use TTS for reliability on "Any Word".
    return new Promise((resolve) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = 1.0;
            utterance.onend = resolve;
            utterance.onerror = resolve;
            window.speechSynthesis.speak(utterance);
        } else {
            setTimeout(resolve, 1000);
        }
    });
};

const speakJapanese = (text) => {
    return new Promise((resolve) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'ja-JP';
            utterance.rate = 1.0;
            utterance.onend = resolve;
            utterance.onerror = resolve;
            window.speechSynthesis.speak(utterance);
        } else {
            setTimeout(resolve, 1000);
        }
    });
};


export default function BlockLearnView({ words, onComplete }) {
    // 10 words block.
    // Auto play sequence for each word:
    // 1. En Audio -> Wait -> Ja Audio -> Wait -> En Audio -> Wait -> Next Word

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [loopState, setLoopState] = useState('idle'); // en1, ja, en2, waiting
    const isMounted = useRef(true);

    const currentWord = words[currentIndex];

    useEffect(() => {
        isMounted.current = true;

        // Auto start sequence when index changes
        if (isPlaying) {
            runSequence();
        }

        return () => {
            isMounted.current = false;
            window.speechSynthesis.cancel();
        };
    }, [currentIndex, isPlaying]);

    const runSequence = async () => {
        if (!currentWord) return;

        // 1. English
        setLoopState('en1');
        await playAudio(currentWord.word);
        if (!isMounted.current || !isPlaying) return;
        await new Promise(r => setTimeout(r, 500));

        // 2. Japanese
        setLoopState('ja');
        // Strip pronunciation from meaning for TTS
        const cleanMeaning = currentWord.meaning.replace(/[0-9]/g, '');
        await speakJapanese(cleanMeaning);
        if (!isMounted.current || !isPlaying) return;
        await new Promise(r => setTimeout(r, 500));

        // 3. English Again
        setLoopState('en2');
        await playAudio(currentWord.word);
        if (!isMounted.current || !isPlaying) return;
        await new Promise(r => setTimeout(r, 800)); // Longer pause before next

        // Next
        if (currentIndex < words.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setIsPlaying(false);
            setLoopState('done');
            // Auto complete? Or manual?
            // "Zone" flow: Auto move to Test?
            // Let's pause and let user click "Test".
        }
    };

    const togglePlay = () => {
        if (isPlaying) {
            setIsPlaying(false);
            window.speechSynthesis.cancel();
        } else {
            setIsPlaying(true);
        }
    };

    const skip = () => {
        window.speechSynthesis.cancel();
        if (currentIndex < words.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setLoopState('done');
            setIsPlaying(false);
        }
    };

    if (loopState === 'done') {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
                <CheckCircle className="w-20 h-20 text-blue-500 mb-6" />
                <h2 className="text-2xl font-bold mb-4">Block Memorized</h2>
                <p className="text-gray-400 mb-8">Ready for Survival Check?</p>
                <button
                    onClick={onComplete}
                    className="w-full max-w-xs py-4 bg-blue-600 rounded-full font-bold uppercase tracking-widest hover:bg-blue-500"
                >
                    START TEST
                </button>
            </div>
        );
    }

    if (!currentWord) {
        return <div className="p-10 text-center">Loading words...</div>;
    }

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
            <div className="absolute top-4 right-4 text-xs font-mono text-gray-500">
                BLOCK: {currentIndex + 1} / {words.length}
            </div>

            {/* Visualizer */}
            <div className={`w-full max-w-sm aspect-square bg-gray-900 border-2 rounded-2xl flex flex-col items-center justify-center p-8 transition-colors duration-300 ${loopState !== 'idle' ? 'border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : 'border-gray-800'}`}>

                {/* Word */}
                <h2 className={`text-4xl font-black mb-4 transition-opacity duration-300 ${loopState === 'ja' ? 'opacity-30' : 'opacity-100'}`}>
                    {currentWord.word}
                </h2>

                {/* Meaning (Only show during ja phase or always? "Learning" implies always visible or revealed) */}
                <div className={`text-xl font-bold text-blue-400 transition-opacity duration-300 ${loopState === 'ja' ? 'opacity-100' : 'opacity-0'}`}>
                    {currentWord.meaning}
                </div>

                {/* Status Indicator */}
                <div className="flex gap-2 mt-12">
                    <div className={`w-2 h-2 rounded-full ${loopState === 'en1' ? 'bg-white' : 'bg-gray-700'}`} />
                    <div className={`w-2 h-2 rounded-full ${loopState === 'ja' ? 'bg-blue-500' : 'bg-gray-700'}`} />
                    <div className={`w-2 h-2 rounded-full ${loopState === 'en2' ? 'bg-white' : 'bg-gray-700'}`} />
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-6 mt-12">
                <button className="p-4 rounded-full bg-gray-800 text-gray-400 hover:text-white">
                    <RotateCcw size={24} />
                </button>

                <button
                    onClick={togglePlay}
                    className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                >
                    {isPlaying ? <Pause size={32} fill="black" /> : <Play size={32} fill="black" className="ml-1" />}
                </button>

                <button onClick={skip} className="p-4 rounded-full bg-gray-800 text-gray-400 hover:text-white">
                    <FastForward size={24} />
                </button>
            </div>

            <p className="mt-8 text-xs text-gray-500">
                {isPlaying ? 'Auto-Learning in progress...' : 'Paused'}
            </p>
        </div>
    );
}

// Icon helper
function CheckCircle({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
    )
}
