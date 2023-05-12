import React, { useState } from 'react';
import { country } from '../@types';
import Range from './Range';
import './Voter.css';

type VoterProps = {
	country: country;
	onVote: (country: country, votes: { [key: string]: number }) => void;
};

const Voter = ({ country, onVote }: VoterProps) => {
	const categories = ['Outfit', 'Stage performance', 'BOP ability', 'Sangstemme', 'Eurovision faktor'];
	const [votes, setVotes] = useState<{ [key: string]: number }>(
		categories.reduce((acc, curr) => ({ ...acc, [curr]: 5 }), {})
	);

	const handleVoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		try {
            setVotes((prevVotes) => ({ ...prevVotes, [e.target.name]: parseInt(e.target.value) }));
            console.log(votes);
		} catch (e) {
			console.error(e);
		}
	};

	const averageVotesScore = Object.values(votes).reduce((acc, curr) => acc + curr, 0) / categories.length;

	const handleVoteSubmit = () => {
		onVote(country, votes);
	};

	return (
		<div className='voter-container'>
			<div className='voter-header'>
				<img className='voter-flag' src={country.flagUrl} alt={country.countryName} />
				<h2 className='voter-country-name'>{country.countryName}</h2>
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
			<button className='voter-submit-button' onClick={handleVoteSubmit}>
				Send inn din score: {averageVotesScore}
			</button>
		</div>
	);
};

export default Voter;
