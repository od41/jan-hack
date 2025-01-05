import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fromBlobs } from 'viem';

interface CreateGroupForm {
    name: string;
    description: string;
    minStake: string;
    maxMembers: number;
    minDistance: number;
    frequency: string;
}

const CreateGroup: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [form, setForm] = useState<CreateGroupForm>({
        name: '',
        description: '',
        minStake: '0.1',
        minDistance: 100,
        maxMembers: 10,
        frequency: 'daily'
    });

    const validateForm = () => {
        if (form.name.length < 3) {
            setError('Group name must be at least 3 characters long');
            return false;
        }
        if (form.description.length < 10) {
            setError('Description must be at least 10 characters long');
            return false;
        }
        if (parseFloat(form.minStake) <= 0) {
            setError('Minimum stake must be greater than 0');
            return false;
        }
        if (form.maxMembers < 2 || form.maxMembers > 100) {
            setError('Number of members must be between 2 and 100');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/groups/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    pool_id: crypto.randomUUID(), // @TODO: get ID from smart contract
                    metadata: {
                        name: form.name,
                        description: form.description
                    },
                    rules: {
                        min_stake: parseFloat(form.minStake),
                        max_members: form.maxMembers,
                        frequency: form.frequency,
                        min_distance: form.minDistance
                    }
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to create group');
            }

            navigate('/groups');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create group');
        } finally {
            setLoading(false);
        }
    };

    const calculateEndDate = (frequency: string) => {
        const date = new Date();
        switch (frequency) {
            case 'daily':
                date.setDate(date.getDate() + 1);
                break;
            case 'weekly':
                date.setDate(date.getDate() + 7);
                break;
            case 'monthly':
                date.setMonth(date.getMonth() + 1);
                break;
        }
        return date;
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

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

                <div className='w-full flex justify-between items-center gap-4'>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Minimum Stake (GRASS)</label>
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
                </div>

                <div className='w-full flex justify-between items-center gap-4'>

                    <div className='w-full'>
                        <label className="block text-sm font-medium text-gray-700">Frequency</label>
                        <select
                            value={form.frequency}
                            onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm w-full"
                        >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                    </div>

                    <div className='w-full'>
                        <label className="block text-sm font-medium text-gray-700">Min. Distance (KM)</label>
                        <input
                            type="number"
                            value={form.maxMembers}
                            onChange={(e) => setForm({ ...form, minDistance: parseInt(e.target.value) })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full ${loading ? 'bg-purple-400' : 'bg-purple-600'
                        } text-white py-3 rounded-full font-semibold flex items-center justify-center`}
                >
                    {loading ? (
                        <>
                            <span className="mr-2">Creating...</span>
                            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                        </>
                    ) : (
                        'Create Group'
                    )}
                </button>
            </form>
        </div>
    );
};

export default CreateGroup; 