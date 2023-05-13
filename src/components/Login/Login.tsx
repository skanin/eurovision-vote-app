import { signInAnonymously } from 'firebase/auth';
import { collection, doc, setDoc } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { useAuthState, useUpdateProfile } from 'react-firebase-hooks/auth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { auth, db } from '../../firebase';

import './Login.css';

const Login = () => { 
    const [name, setName] = useState('');
    const [updateProfile, updating] = useUpdateProfile(auth);
    const [user, loading] = useAuthState(auth);
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const [pwd, setPwd] = useState<string | null>(null);
	const [disabled, setDisabled] = useState(name.length == 0);

	const storePassword = useCallback((pwd : string) => {
		if (pwd) {
			setPwd(pwd);
		}
	}, []);

	useEffect(() => {
		setDisabled(name.length == 0);
	}, [name]);

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

	const signIn = async () => {
		setDisabled(true);
		if (pwd !== import.meta.env.VITE_LOGIN_PASSWORD) {
			console.log('Wrong password');
			setDisabled(false);
			return;
		}

		const bgColor = '#' + (((1 << 24) * Math.random()) | 0).toString(16).padStart(6, '0');

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
						bgColor: bgColor,
					});
				}
			})
			.then(() => setName(''))
			.catch((error) => {
				console.log(error);
			});
		setDisabled(false);
	};

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value);
	};

	return (
		<div id='login-root'>
			<h1>Hva heter du?</h1>
			<form id='login-form' onSubmit={e => e.preventDefault()}>
			<input type='text' value={name} onChange={handleNameChange} />
			<br />
			{user && !updating && !loading ? (
				''
			) : (
				<button disabled={disabled} onClick={() => signIn()} className='sign-in'>
					Logg inn
				</button>
			)}
			</form>
		</div>
	);  
}

export default Login;
