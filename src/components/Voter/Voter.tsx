import { useMemo } from 'react';
import { DatabaseUser, country, vote } from '../../@types';

import LastVotedCountry from '../LastVotedCountry/LastVotedCountry';
import Leaderboard from '../Leaderboard/Leaderboard';
import TopCountries from '../TopCountries/TopCountries';
import VoteGroup from '../VoteGroup/VoteGroup';
import './Voter.css';

type VoterProps = {
	voter: DatabaseUser;
	votes: vote[];
	countries: country[];
};

type GroupedVotes = { [key: string]: { votes: vote[]; score: number; count: number } };

const Voter = ({ voter, votes, countries }: VoterProps) => {

	const groupedVotes = useMemo<GroupedVotes>(() => {
		return votes.reduce<GroupedVotes>((acc, vote) => {
			const key = `${vote.country}`;
			if (!acc[key]) {
				acc[key] = { votes: [], score: 0, count: 0 };
			}
			acc[key].votes.push(vote);
			acc[key].score += vote.score;
			acc[key].count++;
			return acc;
		}, {});
	}, [votes]);

	const lastVotedCountry = useMemo(() => {
		const sortedVotes = votes.sort(
			(a, b) => b.timestamp.toDate().getTime() - a.timestamp.toDate().getTime()
		);
		const lastVote = sortedVotes[0];
		return countries.find((country) => country.id === lastVote?.country);
	}, [votes, countries]);

	const lastVotedCountryAverageScore = useMemo(() => {
		const lastVotedCountryVotes = votes.filter((vote) => vote.country === lastVotedCountry?.id);
		const totalScore = lastVotedCountryVotes.reduce((acc, vote) => acc + vote.score, 0);
		return totalScore / lastVotedCountryVotes.length;
	}, [votes, lastVotedCountry]);

	const topFiveCountries = useMemo(() => {
		return Object.entries(groupedVotes)
			.sort(([, a], [, b]) => b.score - a.score)
			.slice(0, 5)
			.map(([key]) => countries.find((country) => country.id === key));
	}, [groupedVotes, countries]);

	const getTextColor = (backgroundColor: string) => {
		const c = backgroundColor.substring(1);
		const rgb = parseInt(c, 16); 
		const r = (rgb >> 16) & 0xff;
		const g = (rgb >> 8) & 0xff; 
		const b = (rgb >> 0) & 0xff; 

		const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;

		return luma < 60 ? 'white' : 'black';
	}

	const bgColor = '#' + (((1 << 24) * Math.random()) | 0).toString(16).padStart(6, '0');

	return (
		<div className='voter-flex'>
			<div
				style={{
					backgroundColor: bgColor,
					color: getTextColor(bgColor),
				}}
				className='voterHeaderName'>
				{voter.name}
			</div>
			<LastVotedCountry
				lastVotedCountry={lastVotedCountry}
				lastVotedCountryAverageScore={lastVotedCountryAverageScore}
			/>
			<TopCountries countries={topFiveCountries} />
			{/* {Object.entries(groupedVotes).map(([key, { votes, score, count }]) => (
				<VoteGroup
					key={key}
					countryId={key}
					votes={votes}
					score={score}
					count={count}
					countries={countries}
				/>
			))} */}
		</div>
	);
};

export default Voter;
