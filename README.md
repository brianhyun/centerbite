# CenterBite

CenterBite is a web application that helps users find restaurants around the geometric median of a set of addresses. It utilizes the Mapbox API for address search and marker placement on a map and the Yelp Fusion API for restaurant recommendations. The frontend is built with React, and the backend is implemented using Express.js.

[![Watch the Demo Video](https://img.youtube.com/vi/D9I9Ok4Qszw/0.jpg)](https://www.youtube.com/watch?v=D9I9Ok4Qszw)

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Keys](#api-keys)
- [Future Improvements and Development Plans](#future-improvements-and-development-plans)
- [Existing Bugs](#existing-bugs)
- [Project Credits and Development Timeline](#project-credits-and-development-timeline)
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

## Future Improvements and Development Plans

### Code Refactoring and Technical Enhancements

- _express-generator-typescript_ is overkill; only a single route is needed for retrieving the restaurant data.
- Move each section of the page to a separate file and use the context API to manage shared state across the components.

### User Interface

- Have an option to disable fly-to animations.
- Show _Open until X_ in restaurant card.
- Show only 5-8 restaurants and have a randomize button.
- Long restaurant names make cards look too cramped.
- When searching for an address, there is a dotted border that I'd like to remove.
- Show toast and loading icon while restaurants and isochrone polygon data are being retrieved.
- The _X icon_ that closes the restaurant popup needs padding. Make popup icon visually consistent with the rest of the application.
- Change the overall layout to a two-column structure with the map view in one column and the restaurant list in the other. This removes the need for the _Show on map_ button, which disorients the user if a restaurant from the bottom of the list is selected.
- Adapt the UI to be responsive, ensuring seamless user experience across various devices and screen sizes, including desktops, tablets, and smartphones. Focus on smaller screen sizes.

### Enhanced Accessibility

- Modifications to ensure the UI is accessible to users with disabilities, such as implementing keyboard shortcuts, ARIA roles, or other accessibility features.n

### Customization

- Create a profile and allows users to add their dietary preferences.
- Allow adding additional addresses by clicking on the map.
- Option to select the type of centering algorithm used, e.g., simple average, bounding box center, weighted center, or geometric median.
- Option to select the types of businesses recommended, e.g., restaurats, shopping, or hair salons, in additive fashion and the number of businesses recommended.
- Option to enter the distance from the center to filter search results.
- Instead of the food icon, have a number icon for easier searchability.

## Existing Bugs

- Clearing map search box causes refresh.
- Restaurants aren't return on first load of project.
- On add address, popups still remain.

## Project Credits and Development Timeline

### Developer

- **Brian Hyun** - Sole Developer

### Project Timeline

- **Project Start Date:** 10/24/23
- **Project Completion Date:** 10/24/23
- **Estimated Total Hours:** 12

## License

This project is licensed under the [MIT License](LICENSE.md) - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgements

- Thanks to Mapbox and Yelp for providing their APIs. All restaurant images are from the Yelp API.
- Hat tip to the developers of React, Express.js, and other open-source libraries used in this project.
