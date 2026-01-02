// CurriculumManager.js

const TAKEDA_STORAGE_KEY = 'takeda_progress_v1';
const CYCLE_LENGTH = 7;

// 4 Days Advance, 2 Days Review, 1 Day Test
const CYCLE_SCHEDULE = {
    1: 'advance',
    2: 'advance',
    3: 'advance',
    4: 'advance',
    5: 'review',
    6: 'review',
    7: 'test'
};

const DEFAULT_STATE = {
    currentDay: 1, // Global Day (1-28 for 4 weeks)
    totalWordsLearned: 0,
    dailyHistory: {}, // { "1": { status: "completed", mistakes: [] } }
    lastAccess: null,
    settings: {
        wordsPerDay: 50,
        datasetId: 'master800'
    }
};

export const CurriculumManager = {
    getState() {
        if (typeof window === 'undefined') return DEFAULT_STATE;
        const json = localStorage.getItem(TAKEDA_STORAGE_KEY);
        const loaded = json ? JSON.parse(json) : DEFAULT_STATE;
        // Merge settings for backward compatibility
        if (!loaded.settings) loaded.settings = DEFAULT_STATE.settings;
        return loaded;
    },

    saveState(state) {
        if (typeof window === 'undefined') return;
        localStorage.setItem(TAKEDA_STORAGE_KEY, JSON.stringify(state));
    },

    reset() {
        this.saveState(DEFAULT_STATE);
        return DEFAULT_STATE;
    },

    updateSettings(newSettings) {
        const state = this.getState();
        state.settings = { ...state.settings, ...newSettings };
        this.saveState(state);
        return state;
    },

    // Get current cycle status
    getDayInfo(dayNumber) {
        const state = this.getState();
        const { wordsPerDay } = state.settings || DEFAULT_STATE.settings;

        const cycleDay = ((dayNumber - 1) % CYCLE_LENGTH) + 1;
        const week = Math.ceil(dayNumber / CYCLE_LENGTH);
        const mode = CYCLE_SCHEDULE[cycleDay];

        // Determine word range
        let start, end;
        if (mode === 'advance') {
            const advanceDaysBefore = this.countAdvanceDays(dayNumber - 1);
            start = (advanceDaysBefore * wordsPerDay) + 1;
            end = start + wordsPerDay - 1;
        } else if (mode === 'review') {
            // Review all words from current week (4 advance days * wordsPerDay)
            const wordsPerWeek = wordsPerDay * 4;
            start = ((week - 1) * wordsPerWeek) + 1;
            end = start + wordsPerWeek - 1;
        } else {
            // Test day: Same as review, full week
            const wordsPerWeek = wordsPerDay * 4;
            start = ((week - 1) * wordsPerWeek) + 1;
            end = start + wordsPerWeek - 1;
        }

        return {
            day: dayNumber,
            cycleDay,
            week,
            mode,
            range: { start, end }
        };
    },

    countAdvanceDays(untilDay) {
        let count = 0;
        for (let i = 1; i <= untilDay; i++) {
            const cDay = ((i - 1) % CYCLE_LENGTH) + 1;
            if (CYCLE_SCHEDULE[cDay] === 'advance') {
                count++;
            }
        }
        return count;
    },

    completeDay(dayNumber, results) {
        const state = this.getState();
        state.dailyHistory[dayNumber] = {
            status: 'completed',
            timestamp: Date.now(),
            results // Store any specific stats
        };

        if (dayNumber === state.currentDay) {
            state.currentDay = dayNumber + 1;
        }

        this.saveState(state);
        return state;
    }
};
