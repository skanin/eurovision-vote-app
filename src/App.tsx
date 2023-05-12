import { useAuthState } from 'react-firebase-hooks/auth';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import CountryChooser from './CountryChooser/CountryChooser';
import LoadWrapper from './LoadWrapper';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import { auth } from './firebase';

const App = () => {
	const [, loading] = useAuthState(auth);

	return (
		<div>
			<LoadWrapper loading={loading}>
				<Routes>
					<Route
						path='/login'
						element={<Login />}
					/>
					<Route path='/leaderboard' element={<Home />} />
					<Route path='/' element={<CountryChooser />} />
				</Routes>
			</LoadWrapper>
		</div>
	);
}

export default App
