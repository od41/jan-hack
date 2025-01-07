import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Group } from '../types';
import { BASE_BACKEND_URL } from '../contexts/AppProvider';
import { getFitFiContract, getTokenContract, publicClient } from '../contracts';
import { useContractRead, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { erc20Abi, parseEther, parseEventLogs } from 'viem';

const JoinGroup: React.FC = () => {
    const { groupId } = useParams<{ groupId: string }>();
    const navigate = useNavigate();
    const [showStakingModal, setShowStakingModal] = useState(false);
    const [isStaking, setIsStaking] = useState(false);
    const [group, setGroup] = useState<Group | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // const [stakeAmount, setStakeAmount] = useState<bigint | null>(null);
    const { address } = useAccount();

    // Get contract config
    const fitFiContract = getFitFiContract();
    const tokenContract = getTokenContract();

    // Contract write hook
    const { writeContract: deposit, data: depositHash, error: depositError } = useWriteContract();
    const { writeContract: tokenApprove, data: tokenApproveHash, error: tokenApproveError } = useWriteContract();

    console.log('tokenApproveError', tokenApproveError)
    console.log('depositError', depositError)

    // Transaction receipt hook
    const { isLoading: isWaitingForDepositTransaction, isSuccess: isTransactionDepositSuccess } =
        useWaitForTransactionReceipt({
            hash: depositHash,
        });

    // Transaction receipt hook
    const { } =
        useWaitForTransactionReceipt({
            hash: tokenApproveHash,
        });

    // Read pool data from smart contract
    const { data: poolData } = useContractRead({
        ...fitFiContract,
        functionName: 'pools',
        args: [BigInt(groupId || '0')],
        // @ts-ignore
        enabled: !!groupId,
    });

    useEffect(() => {
        const fetchGroupData = async () => {
            try {
                // Fetch group data from backend
                const response = await fetch(`${BASE_BACKEND_URL}/api/groups/${groupId}`, {
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch group data');
                }

                const data = await response.json();
                setGroup(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch group');
            } finally {
                setLoading(false);
            }
        };

        if (groupId) {
            fetchGroupData();
        }
    }, [groupId]);

    const approveTokenInContract = async () => {
        const _stakeAmount = parseEther(group.rules.min_stake.toString());

        console.log('tokenContract.address', tokenContract.address)
        // Approve token transfer
        // @ts-ignore
        tokenApprove({
            address: tokenContract.address,
            abi: erc20Abi,
            functionName: 'approve',
            args: [fitFiContract.address, _stakeAmount],
        });

        return true;
    }

    useEffect(() => {
        if (!tokenApproveHash) return;
        const verifyTokenApproveTransaction = async () => {
            // Wait for transaction to be mined
            const receipt = await publicClient.getTransactionReceipt({ hash: tokenApproveHash });
            const _stakeAmount = parseEther(group.rules.min_stake.toString());
            console.log('receipt approve hash', receipt)

            const logs = parseEventLogs({
                abi: erc20Abi,
                eventName: 'Approval',
                args: {
                    owner: address,
                    spender: fitFiContract.address,
                    value: _stakeAmount
                },
                logs: receipt.logs,
            })

            console.log(logs)
            if (logs.length) {
                const depositRes = await depositTokenInContract();
                console.log('depositRes', depositRes)
            }

        }
        verifyTokenApproveTransaction()
    }, [tokenApproveHash, address])

    const depositTokenInContract = async () => {
        const _stakeAmount = parseEther(group.rules.min_stake.toString());
        // Call deposit function on contract
        // @ts-ignore
        deposit({
            address: fitFiContract.address,
            abi: fitFiContract.abi,
            functionName: 'deposit',
            args: [BigInt(groupId), _stakeAmount],
        });

        return true;
    }

    useEffect(() => {
        if (!depositHash) return;
        const verifyDepositTransaction = async () => {
            // Wait for transaction to be mined
            const receipt = await publicClient.getTransactionReceipt({ hash: depositHash });
            const _stakeAmount = parseEther(group.rules.min_stake.toString());

            const logs = parseEventLogs({
                abi: fitFiContract.abi,
                eventName: 'Deposited',
                args: {
                    poolId: BigInt(groupId),
                    user: address,
                    amount: _stakeAmount
                },
                logs: receipt.logs,
            });

            if (logs.length) {
                console.log('deposit success')
            }

        }
        verifyDepositTransaction()
    }, [depositHash])


    const handleStake = async () => {
        if (!group || !groupId) return;

        try {
            setIsStaking(true);
            setError(null);

            // Approve token transfer
            const approved = await approveTokenInContract();
            if (!approved) {
                throw new Error('Failed to approve token transfer');
            }

        } catch (err) {
            console.error('Staking error:', err);
            setError(err instanceof Error ? err.message : 'Failed to stake');
            setIsStaking(false);
        }
    };

    // Watch for transaction success and navigate
    useEffect(() => {
        if (isTransactionDepositSuccess && groupId) {
            setIsStaking(false);
            navigate(`/activity/${groupId}`);
        }
    }, [isTransactionDepositSuccess, groupId, navigate]);

    // Update button state
    const isButtonDisabled = isStaking || isWaitingForDepositTransaction;
    const buttonText = isWaitingForDepositTransaction
        ? 'Confirming Transaction...'
        : isStaking
            ? 'Staking...'
            : `Stake ${group?.rules.min_stake} F$`;

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!group) return <div>Group not found</div>;

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
                        <span className="font-semibold">{group.rules.min_stake} F$</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Min Distance</span>
                        <span className="font-semibold">{group.rules.min_distance} meters</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Frequency</span>
                        <span className="font-semibold capitalize">{group.rules.frequency}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Pool Status</span>
                        <span className="font-semibold">
                            {poolData ? (poolData[4] ? 'Active' : 'Inactive') : 'Unknown'}
                        </span>
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
                        {error && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                {error}
                            </div>
                        )}
                        <p className="text-gray-600 mb-4">
                            You need to stake {group?.rules.min_stake} F$ to join this group.
                        </p>
                        <button
                            onClick={handleStake}
                            disabled={isButtonDisabled}
                            className="w-full bg-purple-600 text-white py-3 rounded-full font-semibold disabled:opacity-50"
                        >
                            {buttonText}
                        </button>
                        <button
                            onClick={() => setShowStakingModal(false)}
                            disabled={isButtonDisabled}
                            className="w-full mt-2 text-gray-600 py-3 disabled:opacity-50"
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