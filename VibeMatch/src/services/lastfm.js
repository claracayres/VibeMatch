const LASTFM_API_KEY = import.meta.env.VITE_LASTFM_API_KEY;
const BASE_URL = "https://ws.audioscrobbler.com/2.0";


async function lastfmFetch(method, params) {
  const url = new URL(BASE_URL);
  url.searchParams.set("method", method);
  url.searchParams.set("api_key", LASTFM_API_KEY);
  url.searchParams.set("format", "json");

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const res = await fetch(url.toString());
  const data = await res.json();

  if (data.error) throw new Error(`Last.fm error: ${data.message}`);

  return data;
}

// Palavras que não são gêneros
const BLACKLIST = new Set([
  "seen live", "favorites", "favourite", "love", "awesome", "best",
  "cool", "beautiful", "amazing", "perfect", "classic",
]);

function normalizeGenre(tag) {
  return tag
    .toLowerCase()
    .replace(/[-\s]+/g, "") // remove hífens e espaços → "k-pop" e "kpop" viram "kpop"
    .trim();
}


function isValidGenre(tag, artistNames = []) {
  const lower = tag.toLowerCase().trim();

  if (BLACKLIST.has(lower)) return false;
  if (tag.length < 3) return false;

  // Remove se for nome de qualquer artista da lista
  for (const name of artistNames) {
    const nameLower = name.toLowerCase();
    if (nameLower.includes(lower) || lower.includes(nameLower)) return false;
  }

  return true;
}

export async function fetchArtistGenres(artistName, allArtistNames = []) {
  try {
    const data = await lastfmFetch("artist.getInfo", { artist: artistName });
    const tags = data?.artist?.tags?.tag || [];

    const seen = new Set();
    const genres = [];

    for (const t of tags) {
      if (!isValidGenre(t.name, [artistName, ...allArtistNames])) continue;

      const normalized = normalizeGenre(t.name);
      if (seen.has(normalized)) continue;

      seen.add(normalized);
      genres.push(t.name);
    }

    return genres.slice(0, 2);
  } catch {
    return [];
  }
}

export async function enrichArtistsWithGenres(artists) {
  // Passa todos os nomes pra filtrar cruzado
  const allNames = artists.map((a) => a.name);

  const enriched = await Promise.all(
    artists.map(async (artist) => {
      const genres = await fetchArtistGenres(artist.name, allNames);
      return { ...artist, genres };
    })
  );
  return enriched;
}