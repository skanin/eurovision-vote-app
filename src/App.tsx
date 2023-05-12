import { useAuthState } from 'react-firebase-hooks/auth';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import LoadWrapper from './LoadWrapper';
import Login from './Login';
import Statistics from './Statistics';
import Home from './components/Home/Home';
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
					<Route path='/statistics' element={<Statistics />} />
					<Route path='/' element={<Home />} />
				</Routes>
			</LoadWrapper>
		</div>
	);
}

export default App
