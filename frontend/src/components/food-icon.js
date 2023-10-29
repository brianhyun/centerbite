export default function FoodIcon({ size, className }) {
  return (
    <img
      width={size}
      height={size}
      alt="Food icon"
      className={className}
      src={process.env.PUBLIC_URL + "/marker/food-icon.svg"}
    />
  );
}
