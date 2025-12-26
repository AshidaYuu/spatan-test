/**
 * storage.js
 * アプリケーションのデータをLocalStorageで管理するためのユーティリティ
 * 生徒データ、テスト履歴、間違い単語リストを管理します。
 */

const KEYS = {
    STUDENTS: 'word-test-app:students',
    RESULTS: 'word-test-app:results',
    MISTAKES: 'word-test-app:mistakes_v2', // v2として新しく管理（旧データとの分離のため）
};

// --- 生徒管理 (Student Management) ---

export const getStudents = () => {
    try {
        const data = localStorage.getItem(KEYS.STUDENTS);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.warn('Failed to load students', e);
        return [];
    }
};

export const addStudent = (name, grade) => {
    const students = getStudents();
    const newStudent = {
        id: crypto.randomUUID(),
        name,
        grade,
        createdAt: new Date().toISOString(),
    };
    students.push(newStudent);
    localStorage.setItem(KEYS.STUDENTS, JSON.stringify(students));
    return newStudent;
};

export const updateStudent = (id, updates) => {
    const students = getStudents();
    const index = students.findIndex(s => s.id === id);
    if (index !== -1) {
        students[index] = { ...students[index], ...updates };
        localStorage.setItem(KEYS.STUDENTS, JSON.stringify(students));
        return students[index];
    }
    return null;
};

export const deleteStudent = (id) => {
    let students = getStudents();
    students = students.filter(s => s.id !== id);
    localStorage.setItem(KEYS.STUDENTS, JSON.stringify(students));

    // 関連データも削除
    // Mistakes
    const allMistakes = getAllMistakes();
    delete allMistakes[id];
    localStorage.setItem(KEYS.MISTAKES, JSON.stringify(allMistakes));

    // Results (履歴は残してもいいが、今回は削除する方針で)
    // 結果データは配列で管理されているので、フィルタリングして保存し直すのはコストが高いかもしれないが、
    // ローカルストレージレベルなら問題ない
    let allResults = getAllResults();
    allResults = allResults.filter(r => r.studentId !== id);
    localStorage.setItem(KEYS.RESULTS, JSON.stringify(allResults));
};


// --- テスト結果履歴 (Test History) ---

const getAllResults = () => {
    try {
        const data = localStorage.getItem(KEYS.RESULTS);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
};

export const saveTestResult = (result) => {
    // result: { studentId, date, score, total, datasetId, range, mistakeCount }
    const results = getAllResults();
    const newResult = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        ...result,
    };
    results.push(newResult);
    localStorage.setItem(KEYS.RESULTS, JSON.stringify(results));
    return newResult;
};

export const getStudentHistory = (studentId) => {
    const results = getAllResults();
    return results
        .filter(r => r.studentId === studentId)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // 新しい順
};

// --- 間違い単語管理 (Mistakes Management) ---

const getAllMistakes = () => {
    try {
        const data = localStorage.getItem(KEYS.MISTAKES);
        return data ? JSON.parse(data) : {};
    } catch (e) {
        return {};
    }
};

export const getStudentMistakes = (studentId) => {
    const all = getAllMistakes();
    return all[studentId] || [];
};

export const saveStudentMistakes = (studentId, mistakes) => {
    const all = getAllMistakes();
    all[studentId] = mistakes;
    localStorage.setItem(KEYS.MISTAKES, JSON.stringify(all));
};

export const addMistakesToStudent = (studentId, newMistakeWords) => {
    if (!studentId || !newMistakeWords || newMistakeWords.length === 0) return;

    const all = getAllMistakes();
    const studentMistakes = all[studentId] || [];

    newMistakeWords.forEach(word => {
        // 既にリストにあるかチェック
        const exists = studentMistakes.some(
            m => m.id === word.id && m.datasetId === word.datasetId
        );
        if (!exists) {
            studentMistakes.push({
                ...word,
                addedAt: new Date().toISOString(),
                mistakeCount: 1, // エラー回数のカウントなども将来的に可能
            });
        } else {
            // 既存の場合はカウントアップ等の処理を入れても良いが、とりあえずは何もしないか、Topに移動するなど
            // 今回は単純なリスト管理とする
        }
    });

    all[studentId] = studentMistakes;
    localStorage.setItem(KEYS.MISTAKES, JSON.stringify(all));
};

export const removeMistakeFromStudent = (studentId, word) => {
    const all = getAllMistakes();
    const studentMistakes = all[studentId] || [];

    const filtered = studentMistakes.filter(
        m => !(m.id === word.id && m.datasetId === word.datasetId)
    );

    all[studentId] = filtered;
    localStorage.setItem(KEYS.MISTAKES, JSON.stringify(all));
};

// --- バックアップと復元 (Backup & Restore) ---

export const exportAllData = () => {
    const data = {
        students: getStudents(),
        results: getAllResults(),
        mistakes: getAllMistakes(),
        version: 1,
        exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
};

export const importAllData = (jsonString) => {
    try {
        const data = JSON.parse(jsonString);
        if (!data.students || !data.results) {
            throw new Error('Invalid data format');
        }

        // バリデーション後に保存
        localStorage.setItem(KEYS.STUDENTS, JSON.stringify(data.students));
        localStorage.setItem(KEYS.RESULTS, JSON.stringify(data.results));
        localStorage.setItem(KEYS.MISTAKES, JSON.stringify(data.mistakes || {}));

        return true;
    } catch (e) {
        console.error('Import failed', e);
        return false;
    }
};
