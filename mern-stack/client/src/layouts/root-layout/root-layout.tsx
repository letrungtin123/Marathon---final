import Footer from './components/footer';
import HeaderLayout from './components/header';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="flex flex-col min-h-screen">
			<HeaderLayout />

			<main className="container flex flex-grow px-4 py-8 mx-auto">
				{children}
			</main>

			<Footer />
		</div>
	);
};

export default RootLayout;
