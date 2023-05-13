import { useAuthState } from 'react-firebase-hooks/auth';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import CountryVoter from './components/CountryVoter/CountryVoter';
import Voter from './components/CountryVoter/Voter';
import Home from './components/Home/Home';
import LoadWrapper from './components/LoadWrapper/LoadWrapper';
import Login from './components/Login/Login';
import { auth } from './firebase';

const App = () => {
	const [, loading] = useAuthState(auth);

	return (
		<div id='appRoot'>
			<LoadWrapper loading={loading}>
				<Routes>
					<Route path='/login' element={<Login />} />
					<Route path='/leaderboard' element={<Home />} />
					<Route path='/vote/:countryId' element={<Voter />} />
					<Route path='/' element={<CountryVoter />} />
				</Routes>
			</LoadWrapper>
		</div>
	);
}

export default App
