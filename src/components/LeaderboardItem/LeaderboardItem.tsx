import { country } from "../../@types";
import './LeaderboardItem.css';

type LeaderboardItemProps = {
    country: country;
    rank: number;
    score: number;
}

const LeaderboardItem = ({ country, rank, score } : LeaderboardItemProps) => {
    return (
        <div className='leaderboard-item'>
            <div>{rank}</div>
            <div className="leaderboard-flag-div">
                <img src={country.flagUrl} alt={country.countryName} />
            </div>
            <div className="leaderboard-item-score">{score.toFixed(2)}</div>
        </div>
    );
};

export default LeaderboardItem;
