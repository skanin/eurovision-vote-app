import { useMemo } from 'react';
import { country, vote } from '../../@types';
import LeaderboardItem from '../LeaderboardItem/LeaderboardItem';
import './Leaderboard.css';

type LeaderboardProps = {
	countries: country[];
	votes: vote[];
};

const Leaderboard = ({ countries, votes }: LeaderboardProps) => {
	const groupedVotes: Record<string, number> = useMemo(() => {
		return votes.reduce<{[key: string]: number}>((acc, vote) => {
			const { country, score } = vote;
			if (!acc[country]) {
				acc[country] = score;
			} else {
				acc[country] += score;
			}
			return acc;
		}, {});
	}, [votes]);

	const averageScores = useMemo(() => {
		return Object.keys(groupedVotes).map((countryId) => {
			return {
				id: countryId,
				score: groupedVotes[countryId] / votes.filter((vote) => vote.country === countryId).length,
			};
		});
	}, [groupedVotes, votes]);

	const sortedCountries = useMemo(() => {
		return countries.sort((a, b) => {
			const { score: aScore = 0 } = averageScores.find((score) => score.id === a?.id) || {};
			const { score: bScore = 0 } = averageScores.find((score) => score.id === b?.id) || {};
			return bScore - aScore;
		});
	}, [countries, averageScores]);

	return (
		<div id='leaderboardRoot'>
			{sortedCountries.map((country, index) => (
				<LeaderboardItem
					key={country.id}
					rank={index + 1}
					country={country}
					score={averageScores.find((score) => score.id === country.id)?.score || 0}
				/>
			))}
		</div>
	);
};

export default Leaderboard;
