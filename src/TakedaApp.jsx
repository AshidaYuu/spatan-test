import React, { useState, useEffect } from 'react';
import { Activity, Zap, CheckCircle, AlertTriangle, Lock } from 'lucide-react';
import { CurriculumManager } from './takeda/CurriculumManager';
import { TakedaDataManager } from './takeda/DataManager';
import TriageView from './takeda/TriageView';
import SurvivalTestView from './takeda/SurvivalTestView';
import BlockLearnView from './takeda/BlockLearnView';
import SetupView from './takeda/SetupView';

export default function TakedaApp({ datasets }) {
    const [state, setState] = useState(CurriculumManager.getState());
    // Initial phase logic: If fresh start, go to setup
    const initialPhase = (state.currentDay === 1 && state.totalWordsLearned === 0) ? 'setup' : 'dashboard';

    const [phase, setPhase] = useState(initialPhase);
    const [dayInfo, setDayInfo] = useState(null);
    const [cycleWords, setCycleWords] = useState([]);
    const [unknownWords, setUnknownWords] = useState([]);

    useEffect(() => {
        // Load Dataset
        const settings = state.settings || { datasetId: 'master800' };
        // Default to master800 if not set
        const datasetId = settings.datasetId;

        if (datasets && datasets[datasetId]) {
            TakedaDataManager.load(datasets[datasetId].data);
        }

        // Load data on mount
        const info = CurriculumManager.getDayInfo(state.currentDay);
        setDayInfo(info);

        // Get REAL words from DataManager
        if (info.range) {
            const words = TakedaDataManager.getRange(info.range.start, info.range.end);
            setCycleWords(words);
        }
    }, [state.currentDay, state.settings, datasets]);

    const handleSetupComplete = (settings) => {
        const newState = CurriculumManager.updateSettings(settings);
        setState(newState);
        setPhase('dashboard');
    };

    const handleTriageComplete = (unknowns) => {
        setUnknownWords(unknowns);
        if (unknowns.length === 0) {
            // All known! Skip to test to confirm mastery physically?
            // Strict mode says: "If you know it, prove it."
            // So we should go to Survival Test with ALL words to verify speed?
            // Or just trust Triage? Triage is "Self Report".
            // Takeda method usually tests everything.
            // Let's Skip Learning but Test ALL if 0 unknowns? Or Test ALL anyway?
            // Logic: Triage -> Learn Unknowns -> Test Unknowns (Loop) -> Test ALL (Confirmation)?
            // For prototype simplification: Learn Unknowns -> Test Unknowns.
            // If 0 unknowns, passed triage phase.
            alert("Perfect Triage! But Strict Mode demands a check.");
            setPhase('survival_test'); // Test all words if 0 unknowns, or just done?
            // If 0 unknowns, let's treat it as "Test All Cycle Words" to prove it.
            if (unknowns.length === 0) setUnknownWords(cycleWords);

            // alert("Perfect Triage! But Strict Mode demands a check.");
            setPhase('survival_test');
        } else {
            setPhase('block_learn'); // Go to learning phase for unknowns
        }
    };

    const handleBlockLearnComplete = () => {
        // After learning, go to survival test
        setPhase('survival_test');
    };

    const handleTestComplete = (passed) => {
        if (passed) {
            // Complete Day
            const newState = CurriculumManager.completeDay(state.currentDay, { score: 100 });
            setState(newState);
            setPhase('dashboard');
        }
    };

    // Mock Gatekeeper for prototype
    const isGatekeeperPassed = false;

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-green-500 selection:text-black">
            {/* Header */}
            <header className="fixed top-0 w-full p-4 flex justify-between items-center z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800">
                <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="font-bold tracking-widest text-sm">THE ZONE</span>
                    <span className="text-xs bg-gray-800 px-2 py-0.5 rounded text-gray-400 border border-gray-700 ml-2">
                        {datasets && state.settings && datasets[state.settings.datasetId]?.title}
                    </span>
                </div>
                <div className="text-xs font-mono text-gray-500">Day {state.currentDay} / 28</div>
            </header>

            {/* Main Content Area */}
            <main className="pt-20 px-4 pb-10 max-w-md mx-auto h-[100dvh] flex flex-col">
                {phase === 'setup' && (
                    <SetupView datasets={datasets} onComplete={handleSetupComplete} />
                )}
                {phase === 'dashboard' && dayInfo && (
                    <div className="flex-1 flex flex-col justify-center items-center gap-8 animate-in fade-in duration-300">
                        <div className="text-center space-y-2">
                            <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                                DAY {state.currentDay}
                            </h1>
                            <div className="flex items-center justify-center gap-2">
                                <span className="px-2 py-1 bg-gray-800 rounded text-xs font-bold uppercase text-gray-400">{dayInfo.mode} MODE</span>
                            </div>
                            <p className="text-gray-400 text-sm tracking-wider uppercase">Target: Words {dayInfo.range.start} - {dayInfo.range.end}</p>
                        </div>

                        {/* Gatekeeper Status */}
                        {!isGatekeeperPassed && dayInfo.mode === 'advance' && state.currentDay > 1 && (
                            <div className="w-full bg-red-900/20 border border-red-900/50 p-4 rounded-xl flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Lock className="text-red-500 w-5 h-5" />
                                    <div className="text-sm text-red-200">Gap Check Required</div>
                                </div>
                                <button className="text-xs bg-red-600 px-3 py-1 rounded text-white font-bold">START</button>
                            </div>
                        )}

                        {/* Main Action Button */}
                        <button
                            onClick={() => setPhase('triage')}
                            className="w-full py-4 bg-white text-black font-black text-lg rounded-full cursor-pointer active:scale-95 transition-transform hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                        >
                            ミッション開始
                        </button>
                        <p className="text-xs text-center text-gray-600">Strict mode enabled. 手加減なし</p>
                    </div>
                )}

                {phase === 'triage' && (
                    <TriageView words={cycleWords} onComplete={handleTriageComplete} />
                )}

                {phase === 'block_learn' && (
                    <BlockLearnView words={unknownWords} onComplete={handleBlockLearnComplete} />
                )}

                {phase === 'survival_test' && (
                    <SurvivalTestView words={unknownWords.length > 0 ? unknownWords : cycleWords} onComplete={handleTestComplete} />
                )}

            </main>
        </div>
    );
}
