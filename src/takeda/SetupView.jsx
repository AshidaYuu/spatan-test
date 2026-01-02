import React, { useState, useEffect } from 'react';
import { Target, Calendar, Calculator, ChevronRight } from 'lucide-react';

export default function SetupView({ datasets, onComplete }) {
    const [selectedDatasetId, setSelectedDatasetId] = useState('master800');
    const [wordsPerDay, setWordsPerDay] = useState(50);
    const [durationWeeks, setDurationWeeks] = useState(0);

    const currentDataset = datasets ? datasets[selectedDatasetId] : null;

    useEffect(() => {
        if (!currentDataset) return;

        // Calculate estimated duration
        // 1900 words. 50 words/day (Advance).
        // 4 advance days per week = 200 words/week.
        // Weeks = 1900 / 200 = 9.5 weeks.

        let totalWords = 1900; // Fallback
        if (currentDataset.data) {
            // Rough count based on lines? Or just hardcode for known sets?
            // Let's count newlines for accuracy
            const count = currentDataset.data.split('\n').filter(l => l.trim() !== '').length;
            totalWords = count;
        }

        const wordsPerWeek = wordsPerDay * 4;
        const weeks = Math.ceil(totalWords / wordsPerWeek);
        setDurationWeeks(weeks);
    }, [selectedDatasetId, wordsPerDay, datasets]);

    const handleStart = () => {
        onComplete({
            datasetId: selectedDatasetId,
            wordsPerDay: wordsPerDay
        });
    };

    return (
        <div className="flex-1 flex flex-col p-6 animate-in fade-in duration-500 max-w-md mx-auto w-full">
            <div className="flex-1 flex flex-col justify-center">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black italic tracking-tighter bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-2">
                        MISSION SETUP
                    </h1>
                    <p className="text-gray-400 text-xs font-mono">作戦計画を立案せよ</p>
                </div>

                {/* 1. Dataset Selection */}
                <div className="mb-8">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-300 mb-3">
                        <Target className="w-4 h-4 text-blue-500" />
                        TARGET (学習する単語帳)
                    </label>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                        {datasets && Object.values(datasets).map(ds => (
                            <button
                                key={ds.id}
                                onClick={() => setSelectedDatasetId(ds.id)}
                                className={`w-full p-4 rounded-xl text-left border transition-all flex items-center justify-between group ${selectedDatasetId === ds.id
                                    ? 'bg-blue-900/30 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                                    : 'bg-gray-900 border-gray-800 text-gray-500 hover:border-gray-600'}`}
                            >
                                <span className="font-bold">{ds.title}</span>
                                {selectedDatasetId === ds.id && <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 2. Pace Setting */}
                <div className="mb-8 bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-300 mb-6">
                        <Calculator className="w-4 h-4 text-green-500" />
                        PACE (1日の学習量)
                    </label>

                    <div className="flex justify-between items-end mb-4">
                        <div className="text-4xl font-black text-white">
                            {wordsPerDay}
                            <span className="text-sm font-medium text-gray-500 ml-2">words / day</span>
                        </div>
                    </div>

                    <input
                        type="range"
                        min="20"
                        max="200"
                        step="10"
                        value={wordsPerDay}
                        onChange={(e) => setWordsPerDay(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 mb-2"
                    />
                    <div className="flex justify-between text-xs text-gray-600 font-mono">
                        <span>SLOW</span>
                        <span>HARD</span>
                        <span>CRAZY</span>
                    </div>
                </div>

                {/* 3. Projection */}
                <div className="flex items-center gap-4 bg-gray-800 p-4 rounded-xl border border-gray-700 mb-8">
                    <Calendar className="w-8 h-8 text-gray-400" />
                    <div>
                        <div className="text-xs text-gray-500 font-mono mb-0.5">ESTIMATED COMPLETION</div>
                        <div className="text-white font-bold">
                            約 <span className="text-yellow-400 text-xl">{durationWeeks}</span> 週間で制覇
                        </div>
                    </div>
                </div>
            </div>

            <button
                onClick={handleStart}
                className="w-full py-4 bg-white text-black font-black text-lg rounded-full flex items-center justify-center gap-2 hover:bg-gray-200 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
                START MISSION <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
}

// Internal CSS for custom scrollbar if needed, but Tailwind usually sufficient
