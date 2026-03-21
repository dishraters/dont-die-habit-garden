'use client';

import { useState } from 'react';

interface PlanningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (planText: string) => void;
  isLoading: boolean;
}

export default function PlanningModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: PlanningModalProps) {
  const [bigWin1, setBigWin1] = useState('');
  const [bigWin2, setBigWin2] = useState('');
  const [bigWin3, setBigWin3] = useState('');
  const [otherTask1, setOtherTask1] = useState('');
  const [otherTask2, setOtherTask2] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const wins = [bigWin1, bigWin2, bigWin3].filter(w => w.trim());
    const tasks = [otherTask1, otherTask2].filter(t => t.trim());

    if (wins.length === 0 && tasks.length === 0) {
      setError('Please add at least one goal or task');
      return;
    }

    const planText = [
      wins.length > 0 ? `Big Wins: ${wins.join(', ')}` : '',
      tasks.length > 0 ? `Other Tasks: ${tasks.join(', ')}` : '',
    ]
      .filter(Boolean)
      .join(' | ');

    onSubmit(planText);
    setBigWin1('');
    setBigWin2('');
    setBigWin3('');
    setOtherTask1('');
    setOtherTask2('');
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 my-8">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="text-5xl mb-2">📋</div>
          <h2 className="text-2xl font-bold text-gray-800">Daily Plan</h2>
          <p className="text-gray-600 text-sm mt-1">What will you accomplish today?</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Big Wins Section */}
        <div className="mb-6">
          <h3 className="font-bold text-gray-800 mb-3">My 3 big wins today will be...</h3>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="1."
              value={bigWin1}
              onChange={(e) => {
                setBigWin1(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-2 border border-cyan-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-sm"
              disabled={isLoading}
            />
            <input
              type="text"
              placeholder="2."
              value={bigWin2}
              onChange={(e) => {
                setBigWin2(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-2 border border-cyan-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-sm"
              disabled={isLoading}
            />
            <input
              type="text"
              placeholder="3."
              value={bigWin3}
              onChange={(e) => {
                setBigWin3(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-2 border border-cyan-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-sm"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Other Tasks Section */}
        <div className="mb-6">
          <h3 className="font-medium text-gray-700 mb-3">2 other things I'll get done...</h3>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Task 1"
              value={otherTask1}
              onChange={(e) => {
                setOtherTask1(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-sm"
              disabled={isLoading}
            />
            <input
              type="text"
              placeholder="Task 2"
              value={otherTask2}
              onChange={(e) => {
                setOtherTask2(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-sm"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-cyan-500 text-white rounded-lg font-semibold hover:bg-cyan-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="inline-block animate-spin">⏳</span>
                Saving...
              </>
            ) : (
              <>
                <span>✓ Set Plan</span>
              </>
            )}
          </button>
        </div>

        {/* Info */}
        <p className="text-xs text-gray-500 text-center mt-4">
          You'll earn 10 DDC + plant growth for completing this habit
        </p>
      </div>
    </div>
  );
}
