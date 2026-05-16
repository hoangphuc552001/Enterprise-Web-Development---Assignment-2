import type { FantasyMovie } from "../types/interfaces";

const API_URL = "https://ia6fqqgrrb.execute-api.us-east-1.amazonaws.com/dev";

interface PlaylistPayload {
  id: string;
  name: string;
  description: string;
  movieIds: number[];
}

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export const getFavourites = async () => {
  const response = await fetch(`${API_URL}/user/favourites`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch favourites");
  }
  return response.json();
};

export const updateFavourites = async (type: string, ids: number[]) => {
  const response = await fetch(`${API_URL}/user/favourites`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ type, ids }),
  });
  if (!response.ok) {
    throw new Error(`Failed to update ${type} favourites`);
  }
  return response.json();
};

export const getPlaylists = async () => {
  const response = await fetch(`${API_URL}/user/playlists`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch playlists");
  }
  return response.json();
};

export const updatePlaylists = async (playlists: PlaylistPayload[]) => {
  const response = await fetch(`${API_URL}/user/playlists`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ playlists }),
  });
  if (!response.ok) {
    throw new Error("Failed to update playlists");
  }
  return response.json();
};

export const getFantasyMovies = async () => {
  const response = await fetch(`${API_URL}/user/fantasy-movies`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch fantasy movies");
  }
  return response.json();
};

export const updateFantasyMovies = async (movies: FantasyMovie[]) => {
  const response = await fetch(`${API_URL}/user/fantasy-movies`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ movies }),
  });
  if (!response.ok) {
    throw new Error("Failed to update fantasy movies");
  }
  return response.json();
};

export const getPresignedUploadUrl = async (
  fileName: string,
  fileType: string,
): Promise<{ uploadUrl: string; fileUrl: string }> => {
  const response = await fetch(`${API_URL}/upload/presigned-url`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ fileName, fileType }),
  });
  if (!response.ok) {
    throw new Error("Failed to get upload URL");
  }
  return response.json();
};

export const uploadFileToS3 = async (file: File): Promise<string> => {
  const { uploadUrl, fileUrl } = await getPresignedUploadUrl(
    file.name,
    file.type,
  );
  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!uploadResponse.ok) {
    throw new Error("Failed to upload image to S3");
  }
  return fileUrl;
};
