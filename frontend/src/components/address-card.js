import { HiXMark } from "react-icons/hi2";

export default function AddressCard({ address, handleRemoveAddress }) {
  return (
    <div className="flex items-center justify-between bg-gray-100 py-2 px-3 rounded-md border border-gray-300 shadow-sm">
      <div>
        <p className="text-sm">{address.properties.address}</p>
        <p className="text-sm">{address.properties.place_formatted}</p>
      </div>
      <div className="group">
        <button
          className="p-2 rounded-full group-hover:bg-gray-200 cursor-pointer"
          onClick={() => handleRemoveAddress(address.properties.mapbox_id)}
        >
          <HiXMark className="w-5 h-5 text-gray-400 group-hover:text-gray-500" />
        </button>
      </div>
    </div>
  );
}
