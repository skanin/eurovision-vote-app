import { country } from '../../@types';
import './LastVotedCountry.css';

type LastVotedCountryProps = {
    lastVotedCountry?: country;
    lastVotedCountryAverageScore: number;
};

const LastVotedCountry = ({ lastVotedCountry, lastVotedCountryAverageScore }: LastVotedCountryProps) => {
    return (
		<>
			{lastVotedCountry ? (
				<div className='last-vote-flex voter-flex-item'>
					<div>Sist stemt:</div>
					<img
						src={lastVotedCountry.flagUrl}
						alt={lastVotedCountry.countryName}
						style={{ transition: 'opacity 4s ease-in-out' }}
					/>
					<div className='vote-score'>
						{lastVotedCountry.countryName}: {lastVotedCountryAverageScore.toFixed(2)}
					</div>
				</div>
			) : (
				<div className='last-vote-flex'>
					<div>Har ikke gitt noen stemmer enda</div>
				</div>
			)}
		</>
	);
};

export default LastVotedCountry;
