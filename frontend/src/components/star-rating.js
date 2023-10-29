export default function StarRating({ rating }) {
  const getStarAssets = (rating) => {
    const floorRating = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    if (hasHalfStar) {
      return `small_${floorRating}_half.png`;
    } else {
      return `small_${floorRating}.png`;
    }
  };

  const assetFile = getStarAssets(rating);

  return (
    <div>
      <img
        alt={`Star ${rating}`}
        src={process.env.PUBLIC_URL + `/yelp/stars/small/${assetFile}`}
      />
    </div>
  );
}
