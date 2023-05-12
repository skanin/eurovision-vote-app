import { country } from '../../@types';
import './LastVotedCountry.css';

type LastVotedCountryProps = {
    lastVotedCountry?: country;
    lastVotedCountryAverageScore: number;
};

const LastVotedCountry = ({ lastVotedCountry, lastVotedCountryAverageScore }: LastVotedCountryProps) => {
    return (
        <>
            {lastVotedCountry && (
                <div className='last-vote-flex'>
                    <div>
                        Sist stemt:
                    </div>
                    <img
                        src={lastVotedCountry.flagUrl}
                        alt={lastVotedCountry.countryName}
                        style={{ transition: 'opacity 4s ease-in-out' }}
                    />
                    <div className='vote-score'>
                        {lastVotedCountry.countryName}: {lastVotedCountryAverageScore.toFixed(2)}
                    </div>
                </div>
            )}
        </>
    );
};

export default LastVotedCountry;
