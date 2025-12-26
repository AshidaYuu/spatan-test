import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, Trophy, AlertCircle, ArrowLeft, Target } from 'lucide-react';
import { getStudentHistory } from '../utils/storage';

const HistoryView = ({ student, onBack }) => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (student) {
            setHistory(getStudentHistory(student.id));
        }
    }, [student]);

    // チャート用のデータ加工（日付順に直す）
    const chartData = useMemo(() => {
        return [...history].reverse().map(h => ({
            date: new Date(h.timestamp).toLocaleDateString(),
            score: h.score,
            total: h.total,
            rate: Math.round((h.score / h.total) * 100),
        }));
    }, [history]);

    const averageScore = useMemo(() => {
        if (history.length === 0) return 0;
        const sum = history.reduce((acc, curr) => acc + (curr.score / curr.total) * 100, 0);
        return Math.round(sum / history.length);
    }, [history]);

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto w-full">
            <div className="flex items-center justify-between mb-8">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors"
                >
                    <ArrowLeft size={20} />
                    戻る
                </button>
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800">{student.name}さんの学習記録</h2>
                    <p className="text-gray-500 text-sm mt-1">これまでの成長を確認しましょう</p>
                </div>
                <div className="w-20"></div> {/* Spacer for centering */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-blue-50 p-4 rounded-lg flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                        <Trophy size={24} />
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">テスト実施回数</div>
                        <div className="text-2xl font-bold text-gray-800">{history.length} <span className="text-sm font-normal text-gray-500">回</span></div>
                    </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg flex items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-full text-green-600">
                        <Target size={24} />
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">平均正答率</div>
                        <div className="text-2xl font-bold text-gray-800">{averageScore}<span className="text-sm text-gray-500">%</span></div>
                    </div>
                </div>
                {/* 将来的に他の指標も追加可能 */}
            </div>

            {history.length > 0 ? (
                <>
                    <div className="mb-10 h-64 w-full">
                        <h3 className="text-lg font-bold text-gray-700 mb-4 px-2 border-l-4 border-blue-500">点数の推移</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickMargin={10} />
                                <YAxis domain={[0, 100]} stroke="#9ca3af" fontSize={12} unit="%" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    labelStyle={{ color: '#6b7280', marginBottom: '4px' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="rate"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 6 }}
                                    name="正答率"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-gray-700 mb-4 px-2 border-l-4 border-green-500">履歴詳細</h3>
                        <div className="overflow-hidden rounded-lg border border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">実施日</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">教材</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">範囲</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">スコア</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {history.map((h) => (
                                        <tr key={h.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} className="text-gray-400" />
                                                    {new Date(h.timestamp).toLocaleString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                                                {h.datasetId === 'master800' ? '英単語マスター800' :
                                                    h.datasetId === 'english-gate' ? 'English Gate' :
                                                        h.datasetId === 'seki-koko' ? '関正生 難関高校英単語' :
                                                            h.datasetId === 'target1900' ? 'ターゲット1900' :
                                                                h.datasetId === 'target1200' ? 'ターゲット1200' : h.datasetId}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                No. {h.range?.start} ~ {h.range?.end}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold">
                                                <span className={`${(h.score / h.total) >= 0.8 ? 'text-green-600' :
                                                        (h.score / h.total) >= 0.5 ? 'text-yellow-600' : 'text-red-500'
                                                    }`}>
                                                    {h.score}
                                                </span>
                                                <span className="text-gray-400 font-normal"> / {h.total}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">まだテストの履歴がありません。<br />テストを受けるとここに記録が表示されます。</p>
                </div>
            )}
        </div>
    );
};

export default HistoryView;
