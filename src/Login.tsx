import { browserLocalPersistence, setPersistence, signInAnonymously } from 'firebase/auth';
import { collection, doc, setDoc } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { useAuthState, useUpdateProfile } from 'react-firebase-hooks/auth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { auth, db } from './firebase';

const Login = () => { 
    const [name, setName] = useState('');
    const [updateProfile, updating] = useUpdateProfile(auth);
    const [user, loading] = useAuthState(auth);
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const [pwd, setPwd] = useState<string | null>(null);

	const storePassword = useCallback((pwd : string) => {
		if (pwd) {
			setPwd(pwd);
		}
	}, []);

	useEffect(() => {
		if (searchParams.has('password')) {
			const pwd = searchParams.get('password');
			if (pwd) {
				searchParams.delete('password');
				console.dir(searchParams.toString());
				setSearchParams(searchParams);
				storePassword(pwd);
			}
		}
	}, [searchParams, setSearchParams, storePassword]);

    useEffect(() => { 
        if (user && !loading) {
            navigate('/');
        }
     }, [user, loading, navigate]);

    setPersistence(auth, browserLocalPersistence);

	const signIn = async () => {
		if (pwd !== import.meta.env.VITE_LOGIN_PASSWORD) {
			console.log('Wrong password');
			return;
		}
		await signInAnonymously(auth)
			.then(async (user) => {
				console.log('Signed in');
				const success = await updateProfile({ displayName: name });
				if (success) {
					user.user.reload();
					return user;
				}
			})
			.then(async (user) => { 
				if (user) { 
					await setDoc(doc(collection(db, 'users'), user.user.uid), {
						name: user.user.displayName,
					});
				}
			})
			.then(() => setName(''))
			.catch((error) => {
				console.log(error);
			});
	};

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value);
	};

	return (
		<div className='App'>
			<h1>Hva heter du?</h1>
			<input type='text' value={name} onChange={handleNameChange} />
			<br />
			{user && !updating && !loading ? (
				''
			) : (
				<button disabled={name.length === 0} onClick={() => signIn()} className='sign-in'>
					Logg inn
				</button>
			)}
		</div>
	);  
}

export default Login;
