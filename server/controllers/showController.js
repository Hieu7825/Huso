import axios from "axios";
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";
import { inngest } from "../inngest/index.js";

// API to get now playing movies from TMDB API
export const getNowPlayingMovies = async (req, res) => {
  try {
    const pagesToFetch = 3; // Lấy 3 pages = 60 movies
    const requests = Array.from({ length: pagesToFetch }, (_, i) =>
      axios.get(
        `https://api.themoviedb.org/3/movie/now_playing?page=${i + 1}`,
        {
          headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
        }
      )
    );

    const responses = await Promise.all(requests);
    const movies = responses.flatMap((response) => response.data.results);

    res.json({ success: true, movies: movies });
  } catch (error) {
    console.error("Error fetching now playing movies:", error);
    res.json({ success: false, message: error.message });
  }
};
// API to add a new show to the database
export const addShow = async (req, res) => {
  try {
    const { movieId, showsInput, showPrice } = req.body;
    let movie = await Movie.findById(movieId);

    if (!movie) {
      // Fetch movie details, credits, and videos in parallel
      const [movieDetailsResponse, movieCreditsResponse, movieVideosResponse] =
        await Promise.all([
          axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
            headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
          }),
          axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
            headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
          }),
          axios.get(
            `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`,
            {
              headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
            }
          ),
        ]);

      const movieApiData = movieDetailsResponse.data;
      const movieCreditsData = movieCreditsResponse.data;
      const movieVideosData = movieVideosResponse.data;

      // Find trailer with priority: Official Trailer > Trailer > Teaser
      const videos = movieVideosData.results || [];
      const trailer =
        videos.find(
          (video) =>
            video.type === "Trailer" &&
            video.site === "YouTube" &&
            video.official === true
        ) ||
        videos.find(
          (video) => video.type === "Trailer" && video.site === "YouTube"
        ) ||
        videos.find(
          (video) => video.type === "Teaser" && video.site === "YouTube"
        );

      const movieDetails = {
        _id: movieId,
        title: movieApiData.title,
        overview: movieApiData.overview,
        poster_path: movieApiData.poster_path,
        backdrop_path: movieApiData.backdrop_path,
        genres: movieApiData.genres,
        casts: movieCreditsData.cast,
        release_date: movieApiData.release_date,
        original_language: movieApiData.original_language,
        tagline: movieApiData.tagline || "",
        vote_average: movieApiData.vote_average,
        vote_count: movieApiData.vote_count,
        runtime: movieApiData.runtime,
        trailer: trailer ? trailer.key : null, // Store YouTube video key
      };

      // Create movie in database
      movie = await Movie.create(movieDetails);
      console.log(
        `✅ Movie created: ${movie.title}, Trailer: ${trailer?.key || "None"}`
      );
    }

    // Create shows
    const showsToCreate = [];
    showsInput.forEach((show) => {
      const showDate = show.date;
      show.time.forEach((time) => {
        const dateTimeString = `${showDate}T${time}`;
        showsToCreate.push({
          movie: movieId,
          showDateTime: new Date(dateTimeString),
          showPrice,
          occupiedSeats: {},
        });
      });
    });

    if (showsToCreate.length > 0) {
      await Show.insertMany(showsToCreate);
    }

    // Trigger Inngest event
    await inngest.send({
      name: "app/show.added",
      data: { movieTitle: movie.title },
    });

    res.json({ success: true, message: "Show added successfully." });
  } catch (error) {
    console.error("Error adding show:", error);
    res.json({ success: false, message: error.message });
  }
};

// API to get all shows from the database
export const getShows = async (req, res) => {
  try {
    const shows = await Show.find({ showDateTime: { $gte: new Date() } })
      .populate("movie")
      .sort({ showDateTime: 1 });

    // Filter unique movies
    const uniqueShows = new Set(shows.map((show) => show.movie));

    res.json({ success: true, shows: Array.from(uniqueShows) });
  } catch (error) {
    console.error("Error fetching shows:", error);
    res.json({ success: false, message: error.message });
  }
};

// API to get a single show from the database
export const getShow = async (req, res) => {
  try {
    const { movieId } = req.params;

    // Get all upcoming shows for the movie
    const shows = await Show.find({
      movie: movieId,
      showDateTime: { $gte: new Date() },
    });

    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.json({ success: false, message: "Movie not found" });
    }

    // Organize shows by date
    const dateTime = {};
    shows.forEach((show) => {
      const date = show.showDateTime.toISOString().split("T")[0];
      if (!dateTime[date]) {
        dateTime[date] = [];
      }
      dateTime[date].push({ time: show.showDateTime, showId: show._id });
    });

    res.json({ success: true, movie, dateTime });
  } catch (error) {
    console.error("Error fetching show:", error);
    res.json({ success: false, message: error.message });
  }
};

// API: Update trailer for a specific movie
export const updateMovieTrailer = async (req, res) => {
  try {
    const { movieId } = req.params;

    console.log(`Fetching trailer for movie ID: ${movieId}`);

    const { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`,
      {
        headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
      }
    );

    const videos = data.results || [];
    console.log(`Found ${videos.length} videos for movie ${movieId}`);

    const trailer =
      videos.find(
        (video) =>
          video.type === "Trailer" &&
          video.site === "YouTube" &&
          video.official === true
      ) ||
      videos.find(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      ) ||
      videos.find(
        (video) => video.type === "Teaser" && video.site === "YouTube"
      );

    if (trailer) {
      await Movie.findByIdAndUpdate(movieId, { trailer: trailer.key });
      console.log(`✅ Trailer updated for movie ${movieId}: ${trailer.key}`);
      res.json({
        success: true,
        message: "Trailer updated successfully",
        trailer: trailer.key,
      });
    } else {
      console.log(`❌ No trailer found for movie ${movieId}`);
      res.json({
        success: false,
        message: "No trailer found for this movie",
      });
    }
  } catch (error) {
    console.error("Error updating trailer:", error);
    res.json({ success: false, message: error.message });
  }
};

// API: Update trailers for all movies
export const updateAllMovieTrailers = async (req, res) => {
  try {
    const movies = await Movie.find({});
    let updated = 0;
    let failed = 0;
    let noTrailer = 0;

    console.log(`Starting trailer update for ${movies.length} movies...`);

    for (const movie of movies) {
      try {
        const { data } = await axios.get(
          `https://api.themoviedb.org/3/movie/${movie._id}/videos?language=en-US`,
          {
            headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
          }
        );

        const videos = data.results || [];
        const trailer =
          videos.find(
            (video) =>
              video.type === "Trailer" &&
              video.site === "YouTube" &&
              video.official === true
          ) ||
          videos.find(
            (video) => video.type === "Trailer" && video.site === "YouTube"
          ) ||
          videos.find(
            (video) => video.type === "Teaser" && video.site === "YouTube"
          );

        if (trailer) {
          await Movie.findByIdAndUpdate(movie._id, { trailer: trailer.key });
          console.log(`✅ Updated: ${movie.title} - ${trailer.key}`);
          updated++;
        } else {
          console.log(`⚠️  No trailer: ${movie.title}`);
          noTrailer++;
        }

        // Add delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 250));
      } catch (error) {
        console.error(
          `❌ Failed to update trailer for movie ${movie._id} (${movie.title}):`,
          error.message
        );
        failed++;
      }
    }

    const summary = {
      total: movies.length,
      updated,
      noTrailer,
      failed,
    };

    console.log("\n=== Trailer Update Summary ===");
    console.log(`Total movies: ${summary.total}`);
    console.log(`✅ Updated: ${summary.updated}`);
    console.log(`⚠️  No trailer: ${summary.noTrailer}`);
    console.log(`❌ Failed: ${summary.failed}`);

    res.json({
      success: true,
      message: `Updated ${updated} trailers. ${noTrailer} movies have no trailer. ${failed} failed.`,
      summary,
    });
  } catch (error) {
    console.error("Error updating all trailers:", error);
    res.json({ success: false, message: error.message });
  }
};
