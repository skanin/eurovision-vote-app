import { DocumentData, QuerySnapshot, collection, onSnapshot } from 'firebase/firestore';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DatabaseUser, country, vote } from '../../@types';
import { db } from '../../firebase';
import Voter from '../Voter/Voter';
import './Voters.css';

type VotersProps = {
    countries: country[];
    votes: vote[];
};

const Voters = ({ countries, votes }: VotersProps) => {
	const [voters, setVoters] = useState<DatabaseUser[]>([]);

    const handleUsersSnapshot = useCallback((snapshot : QuerySnapshot<DocumentData>) => {
		console.log('Fetching users...');
		setVoters(
			snapshot.docs.map((doc) => ({
				id: doc.id,
				name: doc.data().name,
				bgColor: doc.data().bgColor,
			}))
		);
	}, []);

	useEffect(() => {
		const unsub = onSnapshot(collection(db, 'users'), handleUsersSnapshot);

		return unsub;
	}, [handleUsersSnapshot]);

    const sortedVotes = useMemo(() => {
		return voters.reduce<{ [key: string]: vote[] }>((acc, voter) => {
			acc[voter.id] = votes.filter((vote) => vote.userId === voter.id);
			return acc;
		}, {});
	}, [voters, votes]);

	const sortedVoters = useMemo(() => {
		return voters
			.map((voter) => ({
				...voter,
				votes: votes.filter((vote) => vote.userId === voter.id),
			}))
			.map((voter) => ({
				...voter,
				lastVoteTimestamp: voter.votes.length > 0 ? voter.votes[0].timestamp : 0,
			}))
			.sort((a, b) => Number(b.lastVoteTimestamp) - Number(a.lastVoteTimestamp));
    }, [voters, votes]);

	return (
		<div id='votersRoot-grid'>
			{sortedVoters.map((voter) => (
				<Voter key={voter.id} countries={countries} votes={sortedVotes[voter.id]} voter={voter} />
			))}
		</div>
	);
};

export default Voters;
