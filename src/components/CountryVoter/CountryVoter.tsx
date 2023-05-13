import { DocumentData, QuerySnapshot, collection, onSnapshot, query, where } from 'firebase/firestore';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { country, vote } from '../../@types';
import { auth, db } from '../../firebase';
import useRedirectToLogin from '../../hooks/useRedirectToLogin';
import styles from './CountryVoter.module.css';

const CountryVoter = () => {
    const [countries, setCountries] = useState<country[]>([]);
    const [votes, setVotes] = useState<vote[]>([]);
    const [search, setSearch] = useState<string>('');
	const navigate = useNavigate();
	
	const authenicated = useRedirectToLogin();

    const handleVotesSnapshot = useCallback((snapshot: QuerySnapshot<DocumentData>) => {
        console.log('Fetching votes...');
        const retVotes = snapshot.docs.map((doc) => ({ ...(doc.data() as vote), id: doc.id }));
        console.log('Fetched votes!');
		setVotes(retVotes);
	}, []);


	useEffect(() => {
		if (!authenicated) return;

        const unsub = onSnapshot(collection(db, 'countries'), (snapshot) => {
            console.log('Fetching countries...');
            setCountries(snapshot.docs.map((doc) => ({ ...(doc.data() as country), id: doc.id })));
            console.log('Fetched countries!');
        });

        return unsub;
    }, [authenicated]);

	useEffect(() => {
		if (!authenicated) return;

        const unsub = onSnapshot(
            query(collection(db, 'votes'), where('userId', '==', auth.currentUser?.uid)),
            handleVotesSnapshot
        );

        return unsub;
    }, [handleVotesSnapshot, authenicated]);

    const filteredCountries = useMemo(() => {
		return countries
			.filter(
				(country) =>
					!votes.some((vote) => vote.country === country.id) &&
					country.countryName.toLowerCase().startsWith(search)
			)
			.sort((a, b) => a.countryName.localeCompare(b.countryName));
	}, [countries, votes, search]);


    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(event.target.value);
	};

    return (
		<div className={styles.root}>
			<h1 className={styles.title}>Velg et land å stemme på</h1>
			<p className={styles.subtitle}>Land du allerede har stemt på vil bli borte</p>
			<input
				type='text'
				placeholder='Søk...'
				className={styles.search}
				onChange={handleSearchChange}
			/>
			<div className={styles.grid}>
				{filteredCountries.map(({id, flagUrl, countryName}) => (
					<div
						key={id}
						className={styles.country}
						onClick={() => navigate(`/vote/${id}`)}>
                        <img src={flagUrl} alt={ countryName} />
						<div className={styles.countryNameWrapper}>
							<p className={styles.countryName}>{countryName}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default CountryVoter;
