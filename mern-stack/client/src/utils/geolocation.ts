export const myLatitude = 10.865614657496245;
export const myLongitude = 106.60058358345857;

export const caculatorDistance = (): Promise<number> => {
  // const [geolocation, setGeolocation] = useState({
  // 	latitude: 0,
  // 	longitude: 0,
  // });
  // const [error, setError] = useState(false);

  // useEffect(() => {
  // 	if (navigator.geolocation) {
  // 		navigator.geolocation.getCurrentPosition(
  // 			(location) => {
  // 				const { latitude, longitude } = location.coords;
  // 				setGeolocation({ latitude, longitude });
  // 			},
  // 			() => {
  // 				setError(true);
  // 			}
  // 		);
  // 	}
  // }, []);

  // return { geolocation, error, setGeolocation };
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition((position) => {
      const userLatitude = position.coords.latitude;
      const userLongtitude = position.coords.longitude;

      const R = 6371; // bán kính trái đất km
      const dLat = ((userLatitude - myLatitude) * Math.PI) / 180;
      const dLon = ((userLongtitude - myLongitude) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((userLatitude * Math.PI) / 180) *
          Math.cos((myLatitude * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      resolve(distance);
    }, reject);
  });
};
