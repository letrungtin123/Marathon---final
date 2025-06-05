

export const getRecommendedProducts = async (req, res) => {
  try {
    const { userId } = req.params;
    const { data } = await axios.get(`http://localhost:5000/recommend/${userId}`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Recommendation failed', error: error.message });
  }
};

export const getPopularProducts = async (req, res) => {
  try {
    const { data } = await axios.get(`http://localhost:5000/popular`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Fetching popular products failed', error: error.message });
  }
};
