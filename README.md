# Suking Tindahan: A Mood-based Filipino Film Recommendation System

![Suking Tindahan Banner](https://placehold.co/1200x400/000/FFF?text=Suking%20Tindahan%20Banner%20Image)
*(Replace with an actual banner/screenshot of the app)*

## Project Overview

**Suking Tindahan** (meaning "Favorite Store" or "Regular Store") is a centralized web platform designed to address the growing challenge of content overload and decision fatigue in online streaming, particularly for Filipino audiences seeking local films. This system offers a personalized and emotionally intelligent approach to movie recommendations by suggesting Filipino films tailored to a user's current mood. By integrating with a comprehensive movie database, Suking Tindahan aims to enhance content discovery, improve user satisfaction, and highlight the rich cultural offerings of Philippine cinema.

## Live Demo

Experience the application firsthand:
👉 [**Visit Suking Tindahan Live**](https://suking-tindahan.vercel.app/)

## Features

* **Mood-Matched Film Recommendations:** Get personalized movie suggestions based on your current emotional state, choosing from predefined moods like "Masaya" (Happy), "Kinikilig" (In Love), "Malungkot" (Sad), "Pagod" (Tired), "Bored," and "Excited."
* **Discover Filipino Hidden Gems & Classics:** Explore a curated selection of Filipino films, including critically acclaimed classics and indie productions that might be harder to find on mainstream platforms.
* **Comprehensive Movie Information:** Access detailed information for each recommended film, including plot synopses, genres, main cast, release years, high-quality movie posters, and embedded YouTube trailers.
* **Advanced Filtering Options:** Refine your recommendations by:
    * **Time Period:** Select specific decades (e.g., 1980s, 2000s, 2020s) or "All."
    * **Preferred Rating:** Set a minimum audience rating (e.g., 4.0 stars and above) for higher quality suggestions.
    * **Desired Duration:** Adjust a slider to find movies that fit your available time (e.g., 60-180 minutes).
* **User-Friendly Interface:** An intuitive and responsive design built with modern web technologies ensures a seamless experience across desktop, tablet, and mobile devices.

## Technologies Used

* **Frontend:**
    * [Next.js](https://nextjs.org/) (React Framework)
    * [TypeScript](https://www.typescriptlang.org/)
    * [Tailwind CSS](https://tailwindcss.com/)
* **Backend:**
    * Custom API built to consume and serve movie data.
* **Data Source:**
    * [The Movie Database (TMDb) API](https://www.themoviedb.org/documentation/api) (Primary source for film metadata, images, and trailers)
* **Deployment:**
    * [Vercel](https://vercel.com/)

## Installation (Local Development Setup)

To get a local copy of Suking Tindahan up and running for development or testing, follow these steps:

### Prerequisites

Ensure you have the following installed on your system:

* [Node.js](https://nodejs.org/) (LTS version recommended)
* [npm](https://www.npmjs.com/) (usually comes with Node.js) or [Yarn](https://yarnpkg.com/)

### Steps

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/chrisracha/suking-tindahan.git](https://github.com/chrisracha/suking-tindahan.git)
    ```

2.  **Navigate into the project directory:**

    ```bash
    cd suking-tindahan
    ```

3.  **Install dependencies:**

    ```bash
    npm install
    # or if you prefer yarn
    # yarn install
    ```

4.  **Set up environment variables:**

    Create a `.env.local` file in the root of your project. You will need to obtain an API key from TMDb. Add it to your `.env.local` file:

    ```
    # Example .env.local content (replace with your actual TMDb API key)
    NEXT_PUBLIC_TMDB_API_KEY=YOUR_TMDB_API_KEY
    # Add any other environment variables as specified in the project's internal documentation
    ```

5.  **Run the development server:**

    ```bash
    npm run dev
    # or if you prefer yarn
    # yarn dev
    ```

    The application will typically start on `http://localhost:3000`. Open this URL in your web browser.

## Usage (Web Application)

1.  **Select Your Current Mood:** Upon opening the application, you'll be prompted with "KUMUSTA KA NGAYON?" (How are you doing today?). Choose the mood that best describes how you feel.
2.  **Choose a Time Period:** Select your preferred movie era from the available decades (80s, 90s, 00s, 10s, 20s, or All).
3.  **Select Preferred Movie Rating:** Specify the minimum audience rating you desire for the recommendations.
4.  **Adjust Desired Duration:** Use the slider to set a preferred minimum and maximum movie length.
5.  **Submit Preferences:** Click the "Hanapin" (Search) button to receive your personalized Filipino film recommendations.

## API Usage

Suking Tindahan exposes a public API that developers can use to integrate mood-based Filipino movie recommendations into their own applications.

**Base URL:** `https://suking-tindahan.vercel.app`

### Available Endpoints

| Endpoint             | Method | Description                                                               |
| :------------------- | :----- | :------------------------------------------------------------------------ |
| `/api/recommendations` | `GET`  | Provides movie recommendations based on emotion and other filters.      |
| `/api/search`        | `GET`  | Searches for movies using a query string (e.g., movie title).           |
| `/api/movie/[id]`    | `GET`  | Retrieves detailed information about a specific movie by its TMDb ID. |

### Endpoint Details and Examples

#### 1. Recommendations API

* **Endpoint:** `/api/recommendations`
* **Method:** `GET`
* **Query Parameters:**
    * `emotion` (required): Mood keyword (`Masaya`, `Kinikilig`, `Malungkot`, `Pagod`, `Bored`, `Excited`).
    * `popularity` (optional): Integer (1-5) for popularity threshold.
    * `duration` (optional): JSON array with `[min,max]` duration in minutes (e.g., `[30,120]`).
    * `decades` (optional): Comma-separated string of decades (e.g., `80s,90s`).
    * `page` (optional): Page number for paginated results.

* **Example Request (JavaScript Fetch API):**

    ```javascript
    fetch('[https://suking-tindahan.vercel.app/api/recommendations?emotion=Masaya&popularity=4&duration=](https://suking-tindahan.vercel.app/api/recommendations?emotion=Masaya&popularity=4&duration=)[30,120]&decades=80s,90s&page=1')
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error fetching recommendations:', error));
    ```

#### 2. Search API

* **Endpoint:** `/api/search`
* **Method:** `GET`
* **Query Parameters:**
    * `query` (required): The movie title or keyword to search for.

* **Example Request:**

    ```javascript
    fetch('[https://suking-tindahan.vercel.app/api/search?query=Inception](https://suking-tindahan.vercel.app/api/search?query=Inception)')
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error fetching search results:', error));
    ```

#### 3. Movie Details API

* **Endpoint:** `/api/movie/[id]`
* **Method:** `GET`
* **Path Parameter:**
    * `id` (required): The TMDb movie ID for fetching detailed metadata.

* **Example Request:**

    ```javascript
    fetch('[https://suking-tindahan.vercel.app/api/movie/550](https://suking-tindahan.vercel.app/api/movie/550)') // 550 is TMDb ID for Fight Club
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error fetching movie details:', error));
    ```

### Important Notes on API Usage

* All endpoints are currently public and do not require authentication.
* Ensure query parameters (like `duration`) are properly URL-encoded when constructing requests in production environments.

## Future Enhancements (Recommendations from Report)

The project report outlines several recommendations for future improvements:

* **User Accounts & History Tracking:** Implement optional logins to store favorites, mood history, and refine personalization over time.
* **Multilingual Mood Input:** Enhance mood detection to support inputs in Tagalog, Taglish, or regional dialects using advanced NLP models.
* **Collaborative Filtering:** Incorporate a recommendation layer that considers community-based behavior (e.g., "users who felt bored also watched...") to complement mood-based suggestions.
* **Real-Time Feedback Loop:** Allow users to rate or mark recommendations for continuous system learning and adaptation.
* **Expand Movie Sources:** Include indie film archives, festival entries, and content from platforms like FDCP's JuanFlix or Cinemalaya.

## Contributing

Contributions are welcome! If you have suggestions for improvements or find any issues, please feel free to:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/YourFeature` or `bugfix/FixBug`).
3.  Make your changes and commit them (`git commit -m 'Add YourFeature'`).
4.  Push to the branch (`git push origin feature/YourFeature`).
5.  Open a Pull Request.

## License

This project is open-source and available under the [MIT License](LICENSE.md).

## Acknowledgements

This project was developed as a final project report and builds upon research and concepts from:

* The Movie Database (TMDb) for its extensive API.
* Bhushan et al. (2024) for insights into mood-based genre classification.
* Research on decision fatigue in streaming services (Furey, 2023; Joseph, 2025).
* Information on streaming search engines like JustWatch (Tubb, n.d.).
* Google Cloud Natural Language API (referenced as a potential future enhancement for sentiment analysis).
