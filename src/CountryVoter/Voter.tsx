import { collection, doc, onSnapshot, writeBatch } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate, useParams } from 'react-router-dom';
import { country } from '../@types';
import { auth, db } from '../firebase';
import Range from './Range';
import './Voter.css';

const Voter = () => {
	const categories = ['Outfit', 'Stage performance', 'BOP ability', 'Sangstemme', 'Eurovision faktor'];
	const [votes, setVotes] = useState<{ [key: string]: number }>(
		categories.reduce((acc, curr) => ({ ...acc, [curr]: 5 }), {})
	);
	const [country, setCountry] = useState<country | null>(null);
	const { countryId } = useParams();
	const [user, loading] = useAuthState(auth);
	const navigate = useNavigate();
	
	useEffect(() => {
		if (!user && !loading) {
			navigate('/login');
		}
	}, [user, loading, navigate]);

	useEffect(() => {
		if (countryId) {
			const unsub = onSnapshot(doc(db, 'countries', countryId), (doc) => {
				if (doc.exists()) {
					setCountry({ ...(doc.data() as country), id: doc.id });
				} else {
					navigate('/');
				}
			});
			return unsub;
		}
	}, [countryId, navigate]);

	const handleVote = () => {
		if (country === null) return;

		console.log('Voting for', country.countryName, votes);
		const voteRef = collection(db, 'votes');
		const batch = writeBatch(db);

		for (const [voteType, score] of Object.entries(votes)) {
			batch.set(doc(voteRef), {
				country: country.id,
				userId: user?.uid,
				score,
				timestamp: new Date(),
				type: voteType,
			});
		}

		batch
			.commit()
			.then(() => {
				navigate('/');
			})
			.catch(() => alert('Noe feil skjedde, prøv igjen.'));
	};

	const handleVoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		try {
            setVotes((prevVotes) => ({ ...prevVotes, [e.target.name]: parseInt(e.target.value) }));
            console.log(votes);
		} catch (e) {
			console.error(e);
		}
	};

	const averageVotesScore = Object.values(votes).reduce((acc, curr) => acc + curr, 0) / categories.length;

	return (
		<div className='voter-container'>
			<div className='voter-header'>
				<img className='voter-flag' src={country?.flagUrl} alt={country?.countryName} />
				<h2 className='voter-country-name'>{country?.countryName}</h2>
			</div>
			<div className='voter-categories'>
				{categories.map((category, i) => (
					<React.Fragment key={i}>
						<Range
							key={i}
							onChange={handleVoteChange}
							min={0}
							max={10}
							step={1}
                            value={5}
							label={category}
						/>
					</React.Fragment>
				))}
			</div>
			<button className='voter-submit-button' onClick={handleVote}>
				Send inn din score: {averageVotesScore}
			</button>
		</div>
	);
};

export default Voter;
