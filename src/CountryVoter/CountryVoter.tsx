import { collection, doc, onSnapshot, query, where, writeBatch } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { country, vote } from '../@types';
import { auth, db } from '../firebase';
import styles from './CountryVoter.module.css';
import Voter from './Voter';

const CountryVoter = () => {
    const [countries, setCountries] = useState<country[]>([]);
    const [votes, setVotes] = useState<vote[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<country | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (!auth.currentUser)
            navigate('/login');
    }, [navigate]);

    useEffect(() => {        
        const unsub = onSnapshot(collection(db, 'countries'), (snapshot) => {
            console.log('Fetching countries...');
            setCountries(snapshot.docs.map((doc) => ({ ...doc.data() as country, id: doc.id })));
            console.log('Fetched countries!');
        });

        return unsub;
    }, []);

    useEffect(() => {
        const q = query(collection(db, 'votes'), where('userId', '==', auth.currentUser?.uid));
        
        const unsub = onSnapshot(q, (snapshot) => {
            console.log('Fetching votes...');
            setVotes(snapshot.docs.map((doc) => ({ ...(doc.data() as vote), id: doc.id })));
            console.log('Fetched votes!');
        });

        return unsub;
    }, []);

    const filteredCountries = useMemo(() => {
        return countries.filter((country) => !votes.some((vote) => vote.country === country.id)).sort((a, b) => a.countryName.localeCompare(b.countryName));
    }, [countries, votes]);

    const handleVote = (country: country, votes: { [key: string]: number }) => {
        console.log('Voting for', country.countryName, votes);
        const voteRef = collection(db, 'votes');
        const batch = writeBatch(db);
        
        for (const [voteType, score] of Object.entries(votes)) {
            batch.set(doc(voteRef), {
				country: country.id,
				userId: auth.currentUser?.uid,
				score,
				timestamp: new Date(),
				type: voteType,
			});
        }

        batch.commit()
            .then(() => {
                console.log('Voted!');
                setSelectedCountry(null);
            })
            .catch(() => alert("Noe feil skjedde, prøv igjen."));
    };

    return (
		!selectedCountry ? (<div className={styles.root}>
			<h1 className={styles.title}>Velg et land å stemme på</h1>
			<p className={styles.subtitle}>Land du allerede har vil bli borte</p>
			<div className={styles.grid}>
				{filteredCountries.map((country) => (
					<div
						key={country.id}
						className={styles.country}
						onClick={() => setSelectedCountry(country)}
						style={{ backgroundImage: `url(${country.flagUrl})` }}>
						<p className={styles.countryName}>{country.countryName}</p>
					</div>
				))}
			</div>
		</div>) : (<Voter country={selectedCountry} onVote={handleVote}/>)
    );
};

export default CountryVoter;
