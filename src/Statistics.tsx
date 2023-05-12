import { QueryDocumentSnapshot, QuerySnapshot, collection, onSnapshot } from 'firebase/firestore';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { country } from './@types';
import Country from './Country';
import LoadWrapper from './LoadWrapper';
import { auth, db } from './firebase';

const Statistics = () => { 
    const [user] = useAuthState(auth);
    const navigate = useNavigate();
    const [countries, setCountries] = useState<country[]>([]);
    const countriesRef = useRef<country[]>(countries);

    const [loading, setLoading] = useState<boolean>(true);
    
    const updateCountries = useCallback((snapshot: QuerySnapshot<country>) : void => {
        console.log('Fetching countries...');
        
        snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
                if (!countries.some((item) => item.id === change.doc.id))
                    setCountries((prev) => [...prev, { ...change.doc.data(), id: change.doc.id }]);
			}

            if (change.type === 'modified') {
                setCountries((prev) => { 
                   return prev.map((item) => {
						if (item.id === change.doc.id) {
							return {...change.doc.data(), id: change.doc.id};
						}
						return item;
					}); 
                })
			}

            if (change.type === 'removed') {
                setCountries((prev) => prev.filter((item) => item.id !== change.doc.id));
			}
        });
        
    }, [countries]);

    useEffect(() => {
		const converter = {
			toFirestore: (data: country) => data,
            fromFirestore: (snap: QueryDocumentSnapshot) => {
                return snap.data() as country;
			},
		};

        const unsub = onSnapshot(collection(db, 'countries').withConverter(converter), (snapshot) => {
            updateCountries(snapshot);
		});


        setLoading(false);

		return unsub;
    }, [updateCountries]);
    
    useEffect(() => { 
        console.log('Updating countriesRef...');
        countriesRef.current = countries;
    }, [countries])

    
    useEffect(() => { 
        if (!user) {
            navigate('/login');
        }
    }, [navigate, user]);
    
    return (
		<LoadWrapper loading={loading}>
			<div>
				{countries.map((item: country, i: number) => (
					<div>
						<Country key={i} country={item} type='overall' voteValue={1} />
                        <Country key={i} country={item} type='performance' voteValue={ 2 } />
					</div>
				))}
			</div>
		</LoadWrapper>
	);

}

export default Statistics;
