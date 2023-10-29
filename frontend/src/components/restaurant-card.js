import { useState, useEffect } from "react";
import { MdHideImage } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import Badge from "./badge";
import StarRating from "./star-rating";

export default function RestaurantCard({ restaurant, handleSelectCard }) {
  const [imageValid, setImageValid] = useState(null);

  useEffect(() => {
    const checkImage = (url) => {
      const img = new Image();
      img.src = url;
      console.log({ img });
      img.onload = () => {
        setImageValid(true);
      };
      img.onerror = (err_event) => {
        console.log({ err_event });
        setImageValid(false);
      };
    };

    checkImage(restaurant.image_url);
  }, [restaurant.image_url]);

  return (
    <div className="w-full h-44 flex items-center mt-4 rounded-md">
      <div className="rounded-l-lg h-44 w-44 overflow-hidden">
        {imageValid === null ? (
          <div className="h-full bg-gray-200 flex flex-col items-center justify-center space-y-2">
            <AiOutlineLoading3Quarters
              size={24}
              color="#BBBBBB"
              className="animate-spin"
            />
            <p className="text-sm text-gray-400 font-medium">Checking image</p>
          </div>
        ) : imageValid ? (
          <a
            target="_blank"
            rel="noreferrer"
            href={restaurant.url}
            className="hover:cursor-pointer"
          >
            <img
              alt={restaurant.alias}
              src={restaurant.image_url}
              className="object-cover transition duration-300 ease-in-out hover:scale-125 h-44 w-44"
            />
          </a>
        ) : (
          <div className="h-full bg-gray-200 flex flex-col items-center justify-center space-y-2">
            <MdHideImage size={24} color="#BBBBBB" />
            <p className="text-sm text-gray-400 font-medium">
              No image available
            </p>
          </div>
        )}
      </div>
      <div className="grow px-3 py-2 text-sm h-44 flex flex-col items-start justify-between rounded-r-lg border-t border-r border-b border-gray-200">
        <div className="w-full">
          <div className="w-full flex items-center justify-between">
            <div className="space-y-1">
              <a target="_blank" rel="noreferrer" href={restaurant.url}>
                <h3 className="text-base font-medium">{restaurant.name}</h3>
              </a>
              <div className="flex items-center">
                <StarRating rating={restaurant.rating} />
                <p className="font-medium text-gray-800 ml-2">
                  {restaurant.rating.toFixed(1)}
                </p>
                <p className="text-gray-500 ml-1">
                  ({restaurant.review_count} reviews)
                </p>
              </div>
            </div>
            <a target="_blank" rel="noreferrer" href={restaurant.url}>
              <img
                width="26px"
                src={process.env.PUBLIC_URL + "/yelp/burst/yelp_burst.svg"}
                alt="Yelp logo"
              />
            </a>
          </div>

          <p className="mt-2">
            {restaurant.is_closed ? (
              <span className="text-red-700 font-medium">Closed</span>
            ) : (
              <span className="text-green-700 font-medium">Open</span>
            )}{" "}
            • <span className="text-gray-800">{restaurant.price || "N/A"}</span>{" "}
            • <span className="text-gray-800">{restaurant.location.city}</span>{" "}
            <button
              className="font-medium text-blue-600"
              onClick={() => handleSelectCard(restaurant)}
            >
              Show on map &#8594;
            </button>
          </p>
        </div>
        <div className="flex items-center space-x-1">
          {restaurant.categories.map(({ title }, index) => (
            <Badge text={title} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
