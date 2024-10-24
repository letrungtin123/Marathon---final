import { AuthProvider } from './contexts/auth.context';
import { RouterProvider } from 'react-router-dom';
import { routes } from './routes/routes';

function App() {
	return (
		<AuthProvider>
			<RouterProvider router={routes} />
		</AuthProvider>
	);
}

export default App;
