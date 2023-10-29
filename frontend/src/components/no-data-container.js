export default function NoDataContainer({ description, Icon }) {
  return (
    <div className="bg-gray-100 border border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center text-sm shadow-sm">
      {Icon}
      <p className="text-gray-400 mt-2">{description}</p>
    </div>
  );
}
