import { DocumentData, QuerySnapshot, collection, onSnapshot, query, where } from 'firebase/firestore';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { country, vote } from '../../@types';
import { auth, db } from '../../firebase';
import styles from './CountryVoter.module.css';

const CountryVoter = () => {
    const [countries, setCountries] = useState<country[]>([]);
    const [votes, setVotes] = useState<vote[]>([]);
    const [user, loading] = useAuthState(auth);
    const [search, setSearch] = useState<string>('');
    
    const navigate = useNavigate();

    useEffect(() => {
		if (!user && !loading) {
			navigate('/login');
		}
	}, [user, loading, navigate]);

    const handleVotesSnapshot = useCallback((snapshot: QuerySnapshot<DocumentData>) => {
        console.log('Fetching votes...');
        const retVotes = snapshot.docs.map((doc) => ({ ...(doc.data() as vote), id: doc.id }));
        console.log('Fetched votes!');
		setVotes(retVotes);
	}, []);


    useEffect(() => {
        const unsub = onSnapshot(collection(db, 'countries'), (snapshot) => {
            console.log('Fetching countries...');
            setCountries(snapshot.docs.map((doc) => ({ ...(doc.data() as country), id: doc.id })));
            console.log('Fetched countries!');
        });

        return unsub;
    }, []);

    useEffect(() => {
        const unsub = onSnapshot(
            query(collection(db, 'votes'), where('userId', '==', auth.currentUser?.uid)),
            handleVotesSnapshot
        );

        return unsub;
    }, [handleVotesSnapshot]);

    const filteredCountries = useMemo(() => {
        return countries.filter((country) => !votes.some((vote) => vote.country === country.id) &&  country.countryName.toLowerCase().startsWith(search)).sort((a, b) => a.countryName.localeCompare(b.countryName));
    }, [countries, votes, search]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(event.target.value);
	};

    return (
		<div className={styles.root}>
			<h1 className={styles.title}>Velg et land å stemme på</h1>
			<p className={styles.subtitle}>Land du allerede har stempt på vil bli borte</p>
			<input
				type='text'
				placeholder='Søk...'
				className={styles.search}
				onChange={handleSearchChange}
				autoComplete='off'
				autoCapitalize='none'
			/>
			<div className={styles.grid}>
				{filteredCountries.map((country) => (
					<div
						key={country.id}
						className={styles.country}
						onClick={() => navigate(`/vote/${country.id}`)}>
                        <img src={country.flagUrl} alt={ country.countryName} />
						<div className={styles.countryNameWrapper}>
							<p className={styles.countryName}>{country.countryName}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default CountryVoter;
