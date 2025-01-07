import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_BACKEND_URL } from '../contexts/AppProvider';
import { useWriteContract } from 'wagmi'
import { getFitFiContract, publicClient } from '../contracts';
import { decodeEventLog } from 'viem';
import type { FitFiEvents } from '../contracts/FitFi';

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

    const [groupId, setGroupId] = useState<string | null>(null);

    // Get contract config
    const contract = getFitFiContract();
    const { writeContract: contractCreatePool, data: hash, error: writeContractError } = useWriteContract();

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

    useEffect(() => {
        const verifyTransaction = async () => {
            // Wait for transaction to be mined
            const receipt = await publicClient.getTransactionReceipt({ hash });

            // Get pool ID from events
            const event = receipt.logs.find(log => {

                try {
                    const decoded = decodeEventLog({
                        abi: contract.abi,
                        data: log.data,
                        // @ts-ignore
                        topics: log.topics,
                    }) as { eventName: keyof FitFiEvents };
                    return decoded.eventName === 'PoolCreated';
                } catch {
                    return false;
                }
            });

            if (!event) throw new Error('Group creation transaction not found');

            const decodedEvent = decodeEventLog({
                abi: contract.abi,
                data: event.data,
                // @ts-ignore
                topics: event.topics,
            }) as { eventName: keyof FitFiEvents };

            // @ts-ignore
            const _groupId = decodedEvent.args?.poolId;
            setGroupId(_groupId)
        }
        verifyTransaction()
    }, [hash])

    useEffect(() => {
        const createGroup = async () => {
            if (groupId) {
                const res = await createGroupInBackend(groupId, form)
                if (res.ok) {
                    setLoading(false);
                    navigate('/groups');
                }
            }
        }
        createGroup()
    }, [groupId])

    const createGroupInContract = async () => {
        // 1. Create pool on-chain
        const startTime = BigInt(Math.floor(Date.now() / 1000) + 3600); // Start in 1 hour
        const duration = BigInt(form.frequency === 'daily' ? 86400 :
            form.frequency === 'weekly' ? 604800 :
                2592000 // monthly
        );

        // @ts-ignore
        contractCreatePool({
            address: contract.address,
            abi: contract.abi,
            functionName: 'createPool',
            args: [startTime, duration],
        });

        return true;
    }

    const createGroupInBackend = async (groupId: string, form: CreateGroupForm) => {
        try {
            // 2. Create group in backend only after successful contract interaction
            const response = await fetch(`${BASE_BACKEND_URL}/api/groups/create`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    group_id: groupId.toString(),
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
            } else {
                return response;
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create group');
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {

            await createGroupInContract();

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create group');
        }
    };

    if (writeContractError) {
        setError(writeContractError.message)
    }

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
                        <label className="block text-sm font-medium text-gray-700">Min. Stake (GRASS)</label>
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
                            value={form.minDistance}
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