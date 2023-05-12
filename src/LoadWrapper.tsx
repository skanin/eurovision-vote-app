import loadingGif from './assets/loading.gif';

type LoadWrapperProps = {
	loading: boolean;
    error?: string | JSX.Element | JSX.Element[];
	children: string | JSX.Element | JSX.Element[]
};

const LoadWrapper = (props: LoadWrapperProps) => {
	if (props.loading) {
		return <img src={loadingGif} alt='loading...' />;
	} else if (props.error) {
		return <>Error....</>;
	} else {
		return <>{props.children}</>;
	}
};

export default LoadWrapper;
