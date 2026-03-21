'use client';

import { useState } from 'react';

interface DishRatedModalProps {
  mealType: 'breakfast' | 'lunch' | 'dinner';
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dishName: string, healthScore: number, costScore: number) => void;
  isLoading: boolean;
}

const MEAL_EMOJIS = {
  breakfast: '🍳',
  lunch: '🥗',
  dinner: '🍽️',
};

const MEAL_TITLES = {
  breakfast: 'Log Breakfast',
  lunch: 'Log Lunch',
  dinner: 'Log Dinner',
};

export default function DishRatedModal({
  mealType,
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: DishRatedModalProps) {
  const [dishName, setDishName] = useState('');
  const [healthScore, setHealthScore] = useState(5);
  const [costScore, setCostScore] = useState(5);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!dishName.trim()) {
      setError('Please describe what you ate');
      return;
    }

    onSubmit(dishName, healthScore, costScore);
    setDishName('');
    setHealthScore(5);
    setCostScore(5);
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="text-5xl mb-2">{MEAL_EMOJIS[mealType]}</div>
          <h2 className="text-2xl font-bold text-gray-800">{MEAL_TITLES[mealType]}</h2>
          <p className="text-gray-600 text-sm mt-1">Rate your meal</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Dish Name Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What did you eat?
          </label>
          <input
            type="text"
            value={dishName}
            onChange={(e) => {
              setDishName(e.target.value);
              setError('');
            }}
            placeholder="e.g., Grilled salmon with salad"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            disabled={isLoading}
          />
        </div>

        {/* Health Score */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">Health Score</label>
            <span className="text-lg font-bold text-green-600">{healthScore}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={healthScore}
            onChange={(e) => setHealthScore(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-green-500"
            disabled={isLoading}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Unhealthy</span>
            <span>Healthy</span>
          </div>
        </div>

        {/* Cost Score */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">Cost Rating</label>
            <span className="text-lg font-bold text-orange-600">{costScore}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={costScore}
            onChange={(e) => setCostScore(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-orange-500"
            disabled={isLoading}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Cheap</span>
            <span>Expensive</span>
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
            disabled={isLoading || !dishName.trim()}
            className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="inline-block animate-spin">⏳</span>
                Saving...
              </>
            ) : (
              <>
                <span>✓ Log Meal</span>
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
