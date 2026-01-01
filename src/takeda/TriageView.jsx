import React, { useState, useEffect, useRef } from 'react';
import { X, Check } from 'lucide-react';

export default function TriageView({ words, onComplete }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [unknownWords, setUnknownWords] = useState([]);
    const [swipeDirection, setSwipeDirection] = useState(null); // 'left' or 'right'

    const currentWord = words[currentIndex];

    const handleSwipe = (direction) => {
        if (swipeDirection) return; // Prevent double swipe
        setSwipeDirection(direction);

        // Logic
        if (direction === 'left') {
            // Don't Know -> Add to list
            setUnknownWords(prev => [...prev, currentWord]);
        } else {
            // Know -> Exclude
        }

        // Animation delay then next
        setTimeout(() => {
            setSwipeDirection(null);
            if (currentIndex < words.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                // Complete
                const finalUnknowns = direction === 'left' ? [...unknownWords, currentWord] : unknownWords;
                onComplete(finalUnknowns);
            }
        }, 200); // Fast transition
    };

    // Keyboard support for desktop testing
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') handleSwipe('left');
            if (e.key === 'ArrowRight') handleSwipe('right');
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex, swipeDirection]);

    if (!currentWord) return null;

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-sm mb-8 text-center">
                <div className="h-1 bg-gray-800 rounded-full w-full mb-4 overflow-hidden">
                    <div
                        className="h-full bg-blue-500 transition-all duration-300 ease-out"
                        style={{ width: `${((currentIndex) / words.length) * 100}%` }}
                    />
                </div>
                <p className="text-gray-500 font-mono text-xs">TRIAGE: {currentIndex + 1} / {words.length}</p>
            </div>

            {/* Card */}
            <div className={`
        relative w-full max-w-xs aspect-[3/4] bg-gray-900 border border-gray-700 rounded-2xl flex flex-col items-center justify-center p-8
        transition-transform duration-200
        ${swipeDirection === 'left' ? '-translate-x-20 opacity-0 rotate-[-15deg]' : ''}
        ${swipeDirection === 'right' ? 'translate-x-20 opacity-0 rotate-[15deg]' : ''}
      `}>
                <h2 className="text-4xl font-bold mb-4 text-center">{currentWord.word}</h2>
                <div className="text-gray-400 text-sm mb-8">{currentWord.pronunciation || '...'}</div>

                {/* Helper overlay for Swipe */}
                {swipeDirection === 'left' && (
                    <div className="absolute top-4 right-4 text-red-500 border-2 border-red-500 px-2 py-1 rotate-12 font-bold text-2xl">UNKNOWN</div>
                )}
                {swipeDirection === 'right' && (
                    <div className="absolute top-4 left-4 text-green-500 border-2 border-green-500 px-2 py-1 -rotate-12 font-bold text-2xl">KNOW</div>
                )}
            </div>

            {/* Controls */}
            <div className="flex gap-8 mt-10">
                <button
                    onClick={() => handleSwipe('left')}
                    className="w-16 h-16 rounded-full bg-gray-800 border-2 border-red-500/50 text-red-500 flex items-center justify-center cursor-pointer active:scale-90 transition-transform hover:bg-red-500/10"
                >
                    <X size={32} />
                </button>

                <button
                    onClick={() => handleSwipe('right')}
                    className="w-16 h-16 rounded-full bg-gray-800 border-2 border-green-500/50 text-green-500 flex items-center justify-center cursor-pointer active:scale-90 transition-transform hover:bg-green-500/10"
                >
                    <Check size={32} />
                </button>
            </div>

            <div className="mt-8 text-gray-500 text-xs">
                <span className="text-red-400 font-bold">← Unknown</span>
                <span className="mx-2">|</span>
                <span className="text-green-400 font-bold">Know →</span>
            </div>
        </div>
    );
}
