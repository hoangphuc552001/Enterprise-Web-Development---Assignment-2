// this for vercel edge function

export const config = {
  runtime: "edge",
};

export default async function handler(request) {
  const url = new URL(request.url);

  const tmdbPath = url.pathname.replace("/api/tmdb", "");

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "*",
      },
    });
  }

  if (!tmdbPath) {
    return new Response(JSON.stringify({ error: "No TMDB path provided" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  const targetUrl = new URL(`https://api.themoviedb.org/3${tmdbPath}`);

  url.searchParams.forEach((value, key) => {
    targetUrl.searchParams.append(key, value);
  });

  const tmdbKey = process.env.VITE_TMDB_KEY;
  if (!tmdbKey) {
    return new Response(
      JSON.stringify({
        error: "Server missing VITE_TMDB_KEY environment variable",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  }
  targetUrl.searchParams.append("api_key", tmdbKey);

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: {
        Accept: "application/json",
      },
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300, s-maxage=300",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch from TMDB" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  }
}
