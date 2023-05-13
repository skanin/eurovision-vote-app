import { country } from '../../@types';
import './TopCountries.css';

type TopCountriesProps = {
    countries: (country | undefined)[];
};

const TopCountries = ({ countries}: TopCountriesProps) => {
    return (
		<div className='flag-leaderboard'>
			{countries?.map((country) => (
				<img
					key={country?.id}
					className='leaderboard-flag'
					src={country?.flagUrl}
					alt={country?.countryName}
				/>
			))}
		</div>
	);
};

export default TopCountries;
