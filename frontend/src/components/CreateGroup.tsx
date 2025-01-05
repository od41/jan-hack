import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CreateGroupForm {
  name: string;
  description: string;
  minStake: string;
  maxMembers: number;
  frequency: string;
}

const CreateGroup: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<CreateGroupForm>({
    name: '',
    description: '',
    minStake: '0.1',
    maxMembers: 10,
    frequency: 'daily'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add contract interaction here
    navigate('/groups');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Group Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            rows={3}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Minimum Stake (ETH)</label>
          <input
            type="number"
            step="0.01"
            value={form.minStake}
            onChange={(e) => setForm({ ...form, minStake: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Max Members</label>
          <input
            type="number"
            value={form.maxMembers}
            onChange={(e) => setForm({ ...form, maxMembers: parseInt(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Frequency</label>
          <select
            value={form.frequency}
            onChange={(e) => setForm({ ...form, frequency: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-3 rounded-full font-semibold"
        >
          Create Group
        </button>
      </form>
    </div>
  );
};

export default CreateGroup; 