import React, { useState, useEffect, useRef } from 'react';
import { UserPlus, Users, Download, Upload, Trash2, User } from 'lucide-react';
import { getStudents, addStudent, deleteStudent, exportAllData, importAllData } from '../utils/storage';

const StudentManager = ({ onSelectStudent }) => {
    const [students, setStudents] = useState([]);
    const [newStudentName, setNewStudentName] = useState('');
    const [isImporting, setIsImporting] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = () => {
        setStudents(getStudents());
        // Auto-select if only one student? Maybe better to let user choose always for clarity.
    };

    const handleAddStudent = (e) => {
        e.preventDefault();
        if (!newStudentName.trim()) return;

        const student = addStudent(newStudentName.trim(), 'student'); // grade is optional/default
        setStudents([...students, student]);
        setNewStudentName('');
        // Optionally auto-select: onSelectStudent(student);
    };

    const handleDeleteStudent = (e, id) => {
        e.stopPropagation();
        if (window.confirm('本当にこの生徒を削除しますか？\nテスト履歴と間違い単語リストも完全に削除されます。')) {
            deleteStudent(id);
            loadStudents();
        }
    };

    const handleExport = () => {
        const json = exportAllData();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `word-test-backup-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!window.confirm('現在のデータはすべて上書きされます。\nバックアップから復元してよろしいですか？')) {
            e.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const success = importAllData(event.target.result);
            if (success) {
                alert('復元が完了しました。');
                loadStudents();
            } else {
                alert('ファイルの読み込みに失敗しました。正しいバックアップファイルか確認してください。');
            }
            e.target.value = '';
        };
        reader.readAsText(file);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-blue-600 p-6 text-white text-center">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-90" />
                    <h1 className="text-2xl font-bold">学習者を選択</h1>
                    <p className="text-blue-100 mt-2 text-sm">または新しい学習者を登録してください</p>
                </div>

                <div className="p-6">
                    <div className="space-y-3 mb-8">
                        {students.length === 0 ? (
                            <p className="text-center text-gray-500 py-4">学習者が登録されていません</p>
                        ) : (
                            students.map((student) => (
                                <button
                                    key={student.id}
                                    onClick={() => onSelectStudent(student)}
                                    className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold group-hover:bg-blue-200 transition-colors">
                                            {student.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-800">{student.name}</div>
                                            <div className="text-xs text-gray-500">
                                                登録日: {new Date(student.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        onClick={(e) => handleDeleteStudent(e, student.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                        title="削除"
                                    >
                                        <Trash2 size={18} />
                                    </div>
                                </button>
                            ))
                        )}
                    </div>

                    <form onSubmit={handleAddStudent} className="mb-8">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newStudentName}
                                onChange={(e) => setNewStudentName(e.target.value)}
                                placeholder="新しい名前を入力..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                            <button
                                type="submit"
                                disabled={!newStudentName.trim()}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-bold"
                            >
                                <UserPlus size={18} />
                                登録
                            </button>
                        </div>
                    </form>

                    <div className="border-t pt-6">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">データ管理</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={handleExport}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                            >
                                <Download size={16} />
                                バックアップ保存
                            </button>
                            <button
                                onClick={handleImportClick}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                            >
                                <Upload size={16} />
                                データ復元
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept=".json"
                                className="hidden"
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-2 text-center">
                            ※ ブラウザのデータを消去する前にバックアップを保存してください
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentManager;
