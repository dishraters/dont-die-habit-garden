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
  const [planText, setPlanText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!planText.trim()) {
      setError('Please write your plan for today');
      return;
    }

    if (planText.trim().length < 10) {
      setError('Please write at least 10 characters');
      return;
    }

    onSubmit(planText);
    setPlanText('');
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="text-5xl mb-2">📋</div>
          <h2 className="text-2xl font-bold text-gray-800">Daily Plan</h2>
          <p className="text-gray-600 text-sm mt-1">What are you planning to achieve today?</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Text Area */}
        <textarea
          value={planText}
          onChange={(e) => {
            setPlanText(e.target.value);
            setError('');
          }}
          placeholder="Today I plan to..."
          className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none resize-none"
          disabled={isLoading}
        />

        {/* Character Count */}
        <div className="text-right text-xs text-gray-500 mt-2">
          {planText.length} characters
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !planText.trim()}
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
