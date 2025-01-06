import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Group } from '../types';

interface GroupListProps {
    groups?: Group[];
    showMyGroups?: boolean;
}

const dummyGroups: Group[] = [
    { id: '1', name: 'Group 1', description: 'Description 1', totalStaked: '0.1', currentMembers: 5, maxMembers: 10, minStake: '0.1', frequency: 'daily' },
    { id: '2', name: 'Group 2', description: 'Description 2', totalStaked: '0.1', currentMembers: 3, maxMembers: 10, minStake: '0.1', frequency: 'daily' },
];

const GroupList: React.FC<GroupListProps> = ({ groups = dummyGroups, showMyGroups = false }) => {
    const navigate = useNavigate();

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
                            key={group.id}
                            className="bg-white rounded-xl p-4 shadow-md active:bg-gray-50"
                            onClick={() => navigate(`/join-group/${group.id}`)}
                        >
                            <h2 className="text-xl font-semibold">{group.name}</h2>
                            <div className="flex space-x-4 mt-2 text-sm text-gray-600">
                                <span>👥 {group.currentMembers}/{group.maxMembers}</span>
                                <span>💰 {group.minStake}</span>
                                <span>🔄 {group.frequency}</span>
                            </div>
                            <p className="mt-2 text-gray-700">{group.description}</p>
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