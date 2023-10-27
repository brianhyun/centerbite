/**
 * Express router paths go here.
 */

export default {
  Base: "/api",
  Yelp: {
    Base: "/yelp",
    Businesses: {
      Get: "/businesses",
    },
  },
  Users: {
    Base: "/users",
    Get: "/all",
    Add: "/add",
    Update: "/update",
    Delete: "/delete/:id",
  },
} as const;
