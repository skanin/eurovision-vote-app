import {
    QueryDocumentSnapshot,
    QuerySnapshot,
    addDoc,
    collection,
    doc,
    onSnapshot,
    query,
    updateDoc,
    where,
} from 'firebase/firestore';
import { useCallback, useEffect, useRef, useState } from 'react';
import { country, vote } from './@types';
import LoadWrapper from './LoadWrapper';
import { auth, db } from './firebase';

type CountryProps = {
	country: country;
    type: string;
    voteValue: number;
};

const Country = ({ country, type, voteValue }: CountryProps) => {
	const [votes, setVotes] = useState<vote[]>([]);
	const [userVotes, setUserVotes] = useState<vote[]>([]);

	const votesRef = useRef<vote[]>(votes);
	const [loading, setLoading] = useState<boolean>(true);

	const updateVotes = useCallback((snapshot: QuerySnapshot<vote>): void => {
		console.log('Fetching votes...');

		snapshot.docChanges().forEach((change) => {
			if (change.type === 'added') {
				if (!votesRef.current.some((item) => item.id === change.doc.id))
					setVotes((prev) => [...prev, { ...change.doc.data(), id: change.doc.id }]);
			}

			if (change.type === 'modified') {
				setVotes((prev) => {
					return prev.map((item) => {
						if (item.id === change.doc.id) {
							return { ...change.doc.data(), id: change.doc.id };
						}
						return item;
					});
				});
			}

			if (change.type === 'removed') {
				setVotes((prev) => prev.filter((item) => item.id !== change.doc.id));
			}
		});
	}, []);

	const converter = useCallback(() => {
		return {
			toFirestore: (data: vote) => data,
			fromFirestore: (snap: QueryDocumentSnapshot) => {
				return snap.data() as vote;
			},
		};
	}, []);

	useEffect(() => {
		const q = query(collection(db, `votes`), where('countryId', '==', country.id)).withConverter(
			converter()
		);

		const unsub = onSnapshot(q, (snapshot) => {
			updateVotes(snapshot);
		});

		setLoading(false);

		return unsub;
	}, [country.id, updateVotes, converter]);

	useEffect(() => {
		setUserVotes(() => [...votes.filter((vote) => vote.userId === auth.currentUser?.uid)]);
	}, [votes]);

	const add = (voteId: string) => {
		if (!auth.currentUser) return;

		const currVote = userVotes.find((vote) => vote.type === voteId);
		console.log('currVote', currVote);

		if (!currVote) {
			addDoc(collection(db, 'votes'), {
				countryId: country.id,
				userId: auth.currentUser.uid,
				voteType: voteId,
				value: 1,
				timestamp: new Date(),
			});

			return;
		}

		updateDoc(doc(db, `votes/${currVote.id}`), { ...currVote, value: currVote.score + 1 });
	};

	const getVoteGroupings = () => {
		return Array.from(
			votes.reduce(
				(m, { type: voteType, score: value }) => m.set(voteType, (m.get(voteType) || 0) + value),
				new Map()
			),
			([name, value]) => ({ name, value })
		);
	};

	const mapCountries = () => {
		const voteGroupings = getVoteGroupings();

		return (
			<div>
				<h1>{country.countryName}</h1>
				{voteGroupings.length ? (
					voteGroupings.map((voteGroup, i) => {
						return (
							<div key={i}>
								<h2>
									{voteGroup.name}:{' '}
									{voteGroup.value / votes.filter((v) => v.type == voteGroup.name).length}
								</h2>
							</div>
						);
					})
				) : (
					<h2>No votes</h2>
				)}
			</div>
		);
	};

	const addVote = async (
		userId: string | undefined,
		countryId: string,
		voteType: string,
		voteScore: number
	) => {
		// Add vote to votes collection

		if (!userId) return;

		console.log('userId', userId);

		await addDoc(collection(db, 'votes'), {
			userId: userId,
			country: countryId,
			type: voteType,
			score: voteScore,
			timestamp: new Date(),
		});

		console.log('Adding vote');

		// Add vote to votes subcollection for corresponding country
		const countryRef = doc(db, 'countries', countryId);
		await addDoc(collection(countryRef, 'votes'), {
			userId: userId,
			type: voteType,
			score: voteScore,
		});
	};

	return (
		<LoadWrapper loading={loading}>
			<div id={country.countryName}>
				{mapCountries()}

				<button onClick={() => addVote(auth.currentUser?.uid, country.id, type, voteValue)}>
					Add {voteValue} to {type} score
				</button>
			</div>
		</LoadWrapper>
	);
};

export default Country;
