import loadingGif from '../../assets/loading.gif';
import './LoadWrapper.css';

type LoadWrapperProps = {
	loading: boolean;
    error?: string | JSX.Element | JSX.Element[];
	children: string | JSX.Element | JSX.Element[]
};

const LoadWrapper = (props: LoadWrapperProps) => {
	if (props.loading) {
		return <div id ="loadWrapper"><img src={loadingGif} alt='loading...' /></div>;
	} else if (props.error) {
		return <>Error....</>;
	} else {
		return <>{props.children}</>;
	}
};

export default LoadWrapper;
