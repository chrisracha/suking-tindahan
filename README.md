# Suking Tindahan: A Mood-based Filipino Film Recommendation System

Suking Tindahan is a centralized web platform designed to help users discover Filipino films tailored to their current emotional state. It leverages a comprehensive movie database to suggest films that align with user moods, aiming to mitigate decision fatigue and highlight the rich offerings of Filipino cinema.

## Live Demo

Explore the live application here: <https://suking-tindahan.vercel.app/>

## Repository

The full source code for this project is available on GitHub: <https://github.com/chrisracha/suking-tindahan>

## Key Features

* **Mood-Matched Film Suggestions:** Get recommendations based on your current mood (e.g., Masaya, Kinikilig, Malungkot).

* **Discover Hidden Gems & Classics:** Access a wide range of Filipino films, including older classics not easily found elsewhere.

* **Rich Movie Information:** View detailed plot synopses, genres, cast, release years, posters, and trailers.

* **Filtering Options:** Refine searches by time period, preferred rating, and desired duration.

## Technologies Used

* **Frontend:** Next.js, TypeScript, Tailwind CSS

* **Backend:** Custom API consuming TMDb

* **Database/Data Source:** The Movie Database (TMDb) API

* **Deployment:** Vercel

## Usage

1.  Select your current mood.

2.  Choose a preferred time period (e.g., 80s, 90s, 2000s).

3.  Set a minimum movie rating and desired duration.

4.  Click "Hanapin" to get your personalized Filipino film recommendations!

## API Usage

The Suking Tindahan system also provides a public API for developers to integrate mood-based Filipino movie recommendations into their own applications.

**Base URL:** `https://suking-tindahan.vercel.app`

### Example: Get Recommendations

You can fetch movie recommendations based on emotion and other filters using the `/api/recommendations` endpoint.

**Endpoint:** `/api/recommendations`
**Method:** `GET`
**Query Parameters (example):** `emotion` (required), `popularity`, `duration`, `decades`, `page`

```javascript
fetch('[https://suking-tindahan.vercel.app/api/recommendations?emotion=Masaya&popularity=4&duration=](https://suking-tindahan.vercel.app/api/recommendations?emotion=Masaya&popularity=4&duration=)[30,120]&decades=80s,90s&page=1')
  .then(response => response.json())
  .then(data => console.log(data));
