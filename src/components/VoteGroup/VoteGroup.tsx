import { country, vote } from '../../@types';
import Vote from '../Vote/Vote';

type VoteGroupProps = {
        countryId: string;
        votes: vote[];
        score: number;
        count: number;
        countries: country[];
};

const VoteGroup = ({ countryId, votes, score, count, countries }: VoteGroupProps) => {
	const country = countries?.find((country) => country.id === countryId);
	const averageScore = count > 0 ? score / count : 0;

	const countryVoteTotals = votes
		.filter((vote) => vote.country !== countryId)
		.reduce<{ [key: string]: number }>((acc, vote) => {
			if (acc[vote.country]) {
				acc[vote.country]++;
			} else {
				acc[vote.country] = 1;
			}
			return acc;
		}, {});

	const topFiveCountries = Object.entries(countryVoteTotals)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 5)
		.map(([countryId, voteCount]) => ({
			country: countries.find((country) => country.id === countryId),
			voteCount,
		}));

	return (
		<div className='vote-group'>
			{/* <div className='top-five-leaderboard'>
				<h2>Top 5 Voted Countries</h2>
				{topFiveCountries.map(({ country, voteCount }) => (
					<div key={country?.id} className='leaderboard-item'>
						<img
							src={country?.flagUrl}
							alt={country?.countryName}
							height={'50px'}
							width={'50px'}
						/>
						<div className='vote-score'>{voteCount}</div>
					</div>
				))}
			</div>
			<div className='last-score'>
				<h2>Last score</h2>
				<img src={country?.flagUrl} alt={country?.countryName} height={'50px'} width={'50px'} />
				<div className='vote-score'>{averageScore.toFixed(2)}</div>
				{/* {votes.map((vote, i) => (
                    <Vote key={i} score={vote.score} />
                ))} 
			</div> */}
		</div>
	);
};

export default VoteGroup;
