import { browserLocalPersistence, setPersistence, signInAnonymously } from 'firebase/auth';
import { collection, doc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuthState, useUpdateProfile } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';

const Login = () => { 
    const [name, setName] = useState('');
    const [updateProfile, updating] = useUpdateProfile(auth);
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();

    useEffect(() => { 
        if (user && !loading) {
            navigate('/');
        }
     }, [user, loading, navigate]);

    setPersistence(auth, browserLocalPersistence);

	const signIn = async () => {
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
					Sign in
				</button>
			)}
		</div>
	);  
}

export default Login;
