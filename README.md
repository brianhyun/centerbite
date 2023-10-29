# CenterBite

CenterBite is a web application that helps users find restaurants around the geometric median of a set of addresses. It utilizes the Mapbox API for address search and marker placement on a map and the Yelp Fusion API for restaurant recommendations. The frontend is built with React, and the backend is implemented using Express.js.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Keys](#api-keys)
- [Future Features](#future-features)
- [Existing Bugs](#existing-bugs)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Features

- Search for addresses using the Mapbox API and place markers on a map.
- Calculate the geometric median of the addresses.
- Recommend restaurants around the geometric median using the Yelp Fusion API.
- User-friendly interface with interactive maps and restaurant listings.

## Prerequisites

- Node.js and npm installed on your system.
- Mapbox API key.
- Yelp Fusion API key.

## Installation

1. Clone the repository:

```
git clone https://github.com/brianhyun/meet_in_the_middle.git
cd meet_in_the_middle
```

2. Install dependencies for the frontend and backend:

```
cd frontend
npm install
cd ../backend
npm install
```

## Usage

1. Start the backend server:

cd backend
npm run dev

2. Start the frontend development server:

cd frontend
npm run start

3. Open your browser and navigate to `http://localhost:3001` to use the application.

## API Keys

To use the Mapbox API and Yelp Fusion API, you need to obtain API keys from Mapbox and Yelp.

1. Update the `.env` file in the `frontend` directory with your Mapbox API key:

REACT_APP_MAPBOX_ACCESS_TOKEN=your_mapbox_api_key

2. Update the `.env` files in the `env` directory of the `backend` directory with your API keys:

YELP_API_KEY=your_yelp_api_key

## Future Features

- **User Interface**
  - Show _Open until X_ in restaurant card.
  - Long restaurant names make the cards look too cramped.
  - The _X icon_ that closes the restaurant popup needs padding.
  - Show toast and loading icon while restaurants and isochrone polygon are being retrieved.
  - Change the overall layout to a two-column structure with the map view in one column and the restaurant list in the other. This removes the need for the _Show on map_ button, which disorients the user if a restaurant from the bottom of the list is selected.
  - Adapt the UI to be responsive, ensuring seamless user experience across various devices and screen sizes, including desktops, tablets, and smartphones. Focus on smaller screen sizes.
- **Enhanced Accessibility**
  - Modifications to ensure the UI is accessible to users with disabilities, such as implementing keyboard shortcuts, ARIA roles, or other accessibility features.n
- **Customization**
  - Allow adding additional addresses by clicking on the map.
  - Option to select the type of centering algorithm used, e.g., simple average, bounding box center, weighted center, or geometric median.
  - Option to select the types of businesses recommended, e.g., restaurats, shopping, or hair salons, in additive fashion and the number of businesses recommended.
  - Option to enter the distance from the center to filter search results.
  - Instead of the food icon, have a number icon for easier searchability.

## Existing Bugs

- Clearing map search box causes refresh.
- Restaurants aren't return on first load of project.

## License

This project is licensed under the [MIT License](LICENSE.md) - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgements

- Thanks to Mapbox and Yelp for providing their APIs.
- Hat tip to the developers of React, Express.js, and other open-source libraries used in this project.
