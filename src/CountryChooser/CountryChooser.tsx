import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { country, vote } from '../@types';
import { auth, db } from '../firebase';
import styles from './CountryChooser.module.css';

const CountryChooser = () => {
    const [countries, setCountries] = useState<country[]>([]);
    const [votes, setVotes] = useState<vote[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        if (!auth.currentUser)
            navigate('/login');
    }, [navigate]);

    useEffect(() => {        
        const unsub = onSnapshot(collection(db, 'countries'), (snapshot) => {
            console.log('Fetching countries...');
            setCountries(snapshot.docs.map((doc) => ({ ...doc.data() as country, id: doc.id })));
        });

        return unsub;
    }, []);

    useEffect(() => {
        const q = query(collection(db, 'votes'), where('userId', '==', auth.currentUser?.uid));
        
        const unsub = onSnapshot(q, (snapshot) => {
            console.log('Fetching votes...');
            setVotes(snapshot.docs.map((doc) => ({ ...(doc.data() as vote), id: doc.id })));
        });

        return unsub;
    }, []);

    const filteredCountries = useMemo(() => {
        return countries.filter((country) => !votes.some((vote) => vote.country === country.id)).sort((a, b) => a.countryName.localeCompare(b.countryName));
    }, [countries, votes]);

    return (
		<div className={styles.root}>
			<h1 className={styles.title}>Velg et land å stemme på</h1>
			<p className={styles.subtitle}>Land du allerede har vil bli borte</p>
			<div className={styles.grid}>
				{filteredCountries.map((country) => (
					<div
						key={country.id}
						className={styles.country}
						onClick={() => navigate(`/vote/${country.id}`)}
						style={{ backgroundImage: `url(${country.flagUrl})` }}>
						<p className={styles.countryName}>{country.countryName}</p>
					</div>
				))}
			</div>
		</div>
	);};

export default CountryChooser;
