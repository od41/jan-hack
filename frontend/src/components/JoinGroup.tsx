import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Group } from '../types';

const JoinGroup: React.FC = () => {
    const { groupId } = useParams<{ groupId: string }>();
    const navigate = useNavigate();
    const [showStakingModal, setShowStakingModal] = useState(false);
    const [isStaking, setIsStaking] = useState(false);

    // @TODO: Mock group data - replace with actual data fetching
    const group: Group = {
        group_id: groupId || '',
        metadata: {
            name: 'Marathon Masters',
            description: 'Training for the next marathon together!',
            created_at: new Date(),
            signed_up_members: 3
        },
        rules: {
            min_stake: 0.1,
            max_members: 50,
            frequency: 'daily',
            min_distance: 100
        },
        status: 'pending'
    };

    const handleStake = async () => {
        try {
            setIsStaking(true);
            // @TODO: Add contract interaction here
            await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
            navigate(`/activity/${groupId}`);
        } catch (error) {
            console.error('Staking error:', error);
        } finally {
            setIsStaking(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-6">{group.metadata.name}</h1>

                <div className="bg-white rounded-xl p-6 shadow-md space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Members</span>
                        <span className="font-semibold">
                            {group.metadata.signed_up_members}/{group.rules.max_members}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Stake Required</span>
                        <span className="font-semibold">{group.rules.min_stake} ETH</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Min Distance</span>
                        <span className="font-semibold">{group.rules.min_distance} meters</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Frequency</span>
                        <span className="font-semibold capitalize">{group.rules.frequency}</span>
                    </div>

                    <p className="text-gray-700 py-4">{group.metadata.description}</p>

                    <button
                        onClick={() => setShowStakingModal(true)}
                        className="w-full bg-purple-600 text-white py-3 rounded-full font-semibold"
                    >
                        Join Group
                    </button>
                </div>
            </div>

            {showStakingModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-sm">
                        <h2 className="text-xl font-bold mb-4">Stake to Join</h2>
                        <p className="text-gray-600 mb-4">
                            You need to stake {group.rules.min_stake} ETH to join this group.
                        </p>
                        <button
                            onClick={handleStake}
                            disabled={isStaking}
                            className="w-full bg-purple-600 text-white py-3 rounded-full font-semibold disabled:opacity-50"
                        >
                            {isStaking ? 'Staking...' : `Stake ${group.rules.min_stake} ETH`}
                        </button>
                        <button
                            onClick={() => setShowStakingModal(false)}
                            className="w-full mt-2 text-gray-600 py-3"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JoinGroup; 