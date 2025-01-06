import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Group } from '../types';
import { Spinner } from './Layout/Spinner';
import { BASE_BACKEND_URL } from '../contexts/AppProvider';

interface GroupListProps {
    showMyGroups?: boolean;
}

const GroupList: React.FC<GroupListProps> = ({ showMyGroups = false }) => {
    const navigate = useNavigate();
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const url = showMyGroups
                    ? `${BASE_BACKEND_URL}/api/groups/joined`
                    : `${BASE_BACKEND_URL}/api/groups`;
                const response = await fetch(url, {
                    credentials: 'include',
                });
                if (!response.ok) {
                    const { message } = await response.json()
                    throw new Error(message || 'Failed to fetch groups');
                }
                const data = await response.json() as Group[];
                setGroups(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, [showMyGroups]);

    if (loading) return <Spinner />;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">{showMyGroups ? "My Groups" : "Discover Groups"}</h1>
                {!showMyGroups && <button
                    onClick={() => navigate('/create-group')}
                    className="bg-purple-600 text-white px-3 py-1.5 text-sm rounded-full"
                >
                    Create Group
                </button>}
            </div>

            {groups.length > 0 ? (
                <div className="space-y-4">
                    {groups.map((group) => (
                        <div
                            key={group.group_id}
                            className="bg-white rounded-xl p-4 shadow-md active:bg-gray-50 cursor-pointer"
                            onClick={() => navigate(`/join-group/${group.group_id}`)}
                        >
                            <h2 className="text-xl font-semibold">{group.metadata.name}</h2>
                            <div className="flex space-x-4 mt-2 text-sm text-gray-600">
                                <span>👥 {group.metadata.signed_up_members} / {group.rules.max_members}</span>
                                <span>💰 {group.rules.min_stake}</span>
                                <span>🔄 {group.rules.frequency}</span>
                            </div>
                            <p className="mt-2 text-gray-700">{group.metadata.description}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center mt-20">
                    <p>No groups found.</p>
                    <button
                        onClick={() => navigate('/create-group')}
                        className="bg-purple-600 text-white px-4 py-2 rounded-full mt-4"
                    >
                        Create Group
                    </button>
                </div>
            )}
        </div>
    );
};

export default GroupList; 