
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to normalize text for filename
const toFilename = (text) => text.toLowerCase().replace(/[^a-z0-9]/g, '_');

const APP_JSX_PATH = path.join(__dirname, '../src/App.jsx');
const DATA_DIR = path.join(__dirname, '../src/data');
const AUDIO_BASE_PATH = path.join(__dirname, '../public/audio');

const extractWordList = (variableName, sourceFile = APP_JSX_PATH) => {
    if (!fs.existsSync(sourceFile)) {
        console.error(`Source file not found: ${sourceFile}`);
        return [];
    }
    const content = fs.readFileSync(sourceFile, 'utf-8');

    // Extract content between `const VARIABLE_NAME = \`` and the closing backtick
    // Also handle export const ...
    const regex = new RegExp(`(const|export const) ${variableName} = \`([\\s\\S]*?)\`;`);
    const match = content.match(regex);

    if (!match) {
        console.error(`Could not find ${variableName} in ${path.basename(sourceFile)}`);
        return [];
    }

    const rawData = match[2]; // match[2] is the content captured group
    const lines = rawData.split('\n').filter(line => line.trim() !== '');

    const words = lines.map(line => {
        // Parsing logic similar to App.jsx. 
        // Try detailed match first (with pronunciation in brackets)
        const match = line.match(/^(\d+)([a-zA-Z0-9\s\.\-\’\'\/!\?,]+)([^\[]+)(\[(.+?)\])?$/);
        if (!match) {
            // Fallback match for simpler formats like English Gate (ID + Word + Meaning)
            const fallbackMatch = line.match(/^(\d+)([a-zA-Z0-9\s\.\-\’\'\/!\?,]+?)(.*)$/);
            if (fallbackMatch) {
                let wordRaw = fallbackMatch[2].trim();
                // Basic normalization just in case
                return { id: fallbackMatch[1], word: wordRaw };
            }
            return null;
        }
        let wordRaw = match[2].trim();
        return { id: match[1], word: wordRaw };
    }).filter(item => item !== null);

    return words;
};

const DATASETS = [
    { id: 'master800', variable: 'RAW_DATA_MASTER_800', sourceFile: APP_JSX_PATH },
    { id: 'englishGate', variable: 'RAW_DATA_ENGLISH_GATE', sourceFile: APP_JSX_PATH },
    { id: 'seki_koko', variable: 'RAW_DATA_SEKI_KOKO', sourceFile: APP_JSX_PATH },
    { id: 'target1900', variable: 'RAW_DATA_TARGET_1900', sourceFile: path.join(DATA_DIR, 'target1900.js') },
    { id: 'stock3000', variable: 'RAW_DATA_STOCK_3000', sourceFile: path.join(DATA_DIR, 'stock3000.js') },
    { id: 'target1200', variable: 'RAW_DATA_TARGET_1200', sourceFile: path.join(DATA_DIR, 'target1200.js') },
    { id: 'target1400', variable: 'RAW_DATA_TARGET_1400', sourceFile: path.join(DATA_DIR, 'target1400.js') }
];

const generateAudio = () => {
    let totalGenerated = 0;
    let totalSkipped = 0;

    DATASETS.forEach(dataset => {
        console.log(`\nProcessing dataset: ${dataset.id}...`);
        const words = extractWordList(dataset.variable, dataset.sourceFile);

        if (words.length === 0) {
            console.log(`No words found for ${dataset.id}. Skipping.`);
            return;
        }

        const targetDir = path.join(AUDIO_BASE_PATH, dataset.id);

        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        console.log(`Found ${words.length} words in ${dataset.id}.`);

        let generatedCount = 0;
        let skippedCount = 0;

        words.forEach(item => {
            const filenameBase = toFilename(item.word);
            // Skip empty filenames (e.g. if word was empty)
            if (!filenameBase) return;

            const mp3Path = path.join(targetDir, `${filenameBase}.mp3`);
            const m4aPath = path.join(targetDir, `${filenameBase}.m4a`);

            // Check if either exists: skipped
            if (fs.existsSync(mp3Path)) {
                skippedCount++;
                return;
            }
            if (fs.existsSync(m4aPath)) {
                skippedCount++;
                return;
            }

            // Generate .m4a using 'say'
            console.log(`[${dataset.id}] Generating audio for ID ${item.id}: "${item.word}" -> ${filenameBase}.m4a`);
            try {
                execSync(`say -v Samantha -o "${m4aPath}" "${item.word}"`);
                generatedCount++;
            } catch (err) {
                // console.error(`Failed to generate audio for ${item.word}:`, err.message);
                // Do not spam console with expected errors if audio system is busy or fails occasionally
            }
        });

        totalGenerated += generatedCount;
        totalSkipped += skippedCount;
        console.log(`  > Generated: ${generatedCount}`);
        console.log(`  > Skipped: ${skippedCount}`);
    });

    console.log('\n===================================');
    console.log(`All Datasets Complete.`);
    console.log(`Total Generated: ${totalGenerated}`);
    console.log(`Total Skipped: ${totalSkipped}`);
};

generateAudio();
