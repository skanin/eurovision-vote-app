type VoteProps = {
	score: number;
};

const Vote = ({ score }: VoteProps) => {
	return <div className='vote'>{score}</div>;
};

export default Vote;
