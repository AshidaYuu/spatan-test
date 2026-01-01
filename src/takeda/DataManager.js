import { RAW_DATA_TARGET_1900 } from '../data/target1900';

// Helper: Normalize word and meaning (handling trailing digits)
const normalizeWordAndMeaning = (word, meaning) => {
    let normalizedWord = word.trim();
    let normalizedMeaning = meaning.trim();

    const trailingDigitsMatch = normalizedWord.match(/^(.*?)(\d+)$/);
    if (trailingDigitsMatch) {
        const baseWord = trailingDigitsMatch[1].trim();
        const digits = trailingDigitsMatch[2];
        if (baseWord.length > 0) {
            normalizedWord = baseWord;
            normalizedMeaning = `${digits}${normalizedMeaning}`;
        }
    }

    return { word: normalizedWord, meaning: normalizedMeaning };
};

// Parser Logic (Adapted from App.jsx)
const parseWordList = (rawData) => {
    const lines = rawData.split('\n').filter(line => line.trim() !== '');

    return lines.map(line => {
        // Format: ID + Word + Meaning + [Reading]
        const match = line.match(/^(\d+)([a-zA-Z0-9\s\.\-\’\'\/!\?~]+)([^\[]+)(\[(.+?)\])?$/);

        if (!match) {
            // Fallback
            const fallbackMatch = line.match(/^(\d+)([a-zA-Z0-9\s\.\-\’\'\/!\?~]+?)(.*)$/);
            if (!fallbackMatch) {
                return { id: 0, word: line, meaning: 'Parse Error', pronunciation: '', variations: [] };
            }
            const id = parseInt(fallbackMatch[1], 10);
            let word = fallbackMatch[2].trim();
            let meaningRaw = fallbackMatch[3].trim();
            ({ word, meaning: meaningRaw } = normalizeWordAndMeaning(word, meaningRaw));
            return { id, word, meaning: meaningRaw, pronunciation: '' };
        }

        const id = parseInt(match[1], 10);
        let word = match[2].trim();
        let meaningRaw = match[3].trim();
        ({ word, meaning: meaningRaw } = normalizeWordAndMeaning(word, meaningRaw));
        const pronunciation = match[5] ? match[5].trim() : '';

        return {
            id,
            word,
            meaning: meaningRaw,
            pronunciation
        };
    });
};

// Singleton Cache
let cachedWords = null;

export const TakedaDataManager = {
    getAllWords() {
        if (!cachedWords) {
            cachedWords = parseWordList(RAW_DATA_TARGET_1900);
        }
        return cachedWords;
    },

    getRange(start, end) {
        const all = this.getAllWords();
        return all.filter(w => w.id >= start && w.id <= end);
    }
};
