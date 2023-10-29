export default function FoodIcon({ size, color = true, className }) {
  return (
    <img
      width={size}
      height={size}
      alt="Food icon"
      className={className}
      src={
        process.env.PUBLIC_URL +
        `/marker/food-icon-${color ? "color" : "gray"}.svg`
      }
    />
  );
}
