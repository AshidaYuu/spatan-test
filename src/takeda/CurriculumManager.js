// CurriculumManager.js

const TAKEDA_STORAGE_KEY = 'takeda_progress_v1';
const CYCLE_LENGTH = 7;
const DAILY_WORDS_QUOTA = 50;

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
    lastAccess: null
};

export const CurriculumManager = {
    getState() {
        if (typeof window === 'undefined') return DEFAULT_STATE;
        const json = localStorage.getItem(TAKEDA_STORAGE_KEY);
        return json ? JSON.parse(json) : DEFAULT_STATE;
    },

    saveState(state) {
        if (typeof window === 'undefined') return;
        localStorage.setItem(TAKEDA_STORAGE_KEY, JSON.stringify(state));
    },

    reset() {
        this.saveState(DEFAULT_STATE);
        return DEFAULT_STATE;
    },

    // Get current cycle status
    getDayInfo(dayNumber) {
        const cycleDay = ((dayNumber - 1) % CYCLE_LENGTH) + 1;
        const week = Math.ceil(dayNumber / CYCLE_LENGTH);
        const mode = CYCLE_SCHEDULE[cycleDay];

        // Determine word range
        let start, end;
        if (mode === 'advance') {
            // e.g. Day 1 -> 1-50, Day 2 -> 51-100...
            // Previous Advance Days in this cycle: (cycleDay - 1) * 50
            // Previous Weeks words: (week - 1) * 200
            // Actually, simplest is just global calculation based on "Advance Days" passed.
            // But Takeda method is strict: 50 words per *advance* day.
            // Let's assume dayNumber maps directly if strictly followed.
            // Better: Calculate how many "advance" days have happened up to this point.

            const advanceDaysBefore = this.countAdvanceDays(dayNumber - 1);
            start = (advanceDaysBefore * DAILY_WORDS_QUOTA) + 1;
            end = start + DAILY_WORDS_QUOTA - 1;
        } else if (mode === 'review') {
            // Review all words from current week (200 words)
            start = ((week - 1) * 200) + 1;
            end = start + 200 - 1;
        } else {
            // Test day: Same as review, full week
            start = ((week - 1) * 200) + 1;
            end = start + 200 - 1;
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

        // Auto-advance to next day? Or wait for user?
        // User might want to redo. 
        // Usually we just mark complete.
        // Ideally we assume user moves to next day on next session if "today" is done.

        if (dayNumber === state.currentDay) {
            state.currentDay = dayNumber + 1;
        }

        this.saveState(state);
        return state;
    }
};
