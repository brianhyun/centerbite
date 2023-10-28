# Meet in the Middle

Meet in the Middle is a web application that helps users find restaurants around the geometric median of a set of addresses. It utilizes the Mapbox API for address search and marker placement on a map and the Yelp Fusion API for restaurant recommendations. The frontend is built with React, and the backend is implemented using Express.js.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Keys](#api-keys)
- [Contributing](#contributing)
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

## Contributing

Contributions are welcome! Please read our [Contribution Guidelines](CONTRIBUTING.md) before submitting pull requests.

## License

This project is licensed under the [MIT License](LICENSE.md) - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgements

- Thanks to Mapbox and Yelp for providing their APIs.
- Hat tip to the developers of React, Express.js, and other open-source libraries used in this project.
