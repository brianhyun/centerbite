import axios from "axios";
import HttpStatusCodes from "@src/constants/HttpStatusCodes";

import { IUser } from "@src/models/User";
import { IReq, IRes } from "./types/express/misc";

// **** Functions **** //

/**
 * Add one user.
 */
async function getBusinesses(
  req: IReq<{ latitude: string; longitude: string }>,
  res: IRes
) {
  const { latitude, longitude } = req.body;

  try {
    const { data } = await axios({
      method: "GET",
      url: `https://api.yelp.com/v3/businesses/search?term=restaurants&latitude=${latitude}&longitude=${longitude}&open_now=true&sort_by=best_match&limit=20`,
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.YELP_API_KEY}`,
      },
    });

    return res
      .status(HttpStatusCodes.OK)
      .json({ data, message: "Data retrieved!" });
  } catch (error) {
    // Handle the error here
    console.error(error);
  }
}

// **** Export default **** //

export default {
  getBusinesses,
} as const;
