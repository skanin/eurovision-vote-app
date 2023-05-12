import { DocumentData, QuerySnapshot, collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { country, vote } from '../../@types';
import { db } from '../../firebase';
import Leaderboard from '../Leaderboard/Leaderboard';
import Voters from '../Voters/Voters';
import './Home.css';

const Home = () => {
    const [countries, setCountries] = useState<country[]>([]);
    const [votes, setVotes] = useState<vote[]>([]);
    
    useEffect(() => {
        const unsub = onSnapshot(collection(db, 'countries'), (snapshot) => {
            console.log('Fetching countries...');
            setCountries(snapshot.docs.map((doc) => ({ ...doc.data() as country, id: doc.id })));
        });

        return unsub;
    }, []);

    const handleVotesSnapshot = useCallback((snapshot: QuerySnapshot<DocumentData>) => {
		console.log('Fetching votes...');
		const retVotes = snapshot.docs.map((doc) => ({ ...(doc.data() as vote), id: doc.id }));
		setVotes(retVotes);
	}, []);

    useEffect(() => {
		const unsub = onSnapshot(
			query(collection(db, 'votes'), orderBy('timestamp', 'desc')),
			handleVotesSnapshot
		);

		return unsub;
	}, [handleVotesSnapshot]);

    return (
		<div id='homeRoot-grid'>
			<Voters countries={countries} votes={votes} />
			<Leaderboard countries={countries} votes={votes} />
		</div>
	);
}

export default Home;
