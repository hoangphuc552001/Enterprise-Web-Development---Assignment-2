export const AUTH_API_URL =
  "https://nrh7wfd204.execute-api.us-east-1.amazonaws.com/dev";

export const signUp = async (
  username: string,
  email: string,
  password: string,
) => {
  const response = await fetch(`${AUTH_API_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Failed to sign up");
  }

  return response.json();
};

export const confirmSignUp = async (username: string, code: string) => {
  const response = await fetch(`${AUTH_API_URL}/auth/confirm-signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, code }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Failed to confirm sign up");
  }

  return response.json();
};

export const signIn = async (username: string, password: string) => {
  const response = await fetch(`${AUTH_API_URL}/auth/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Failed to sign in");
  }

  return response.json();
};
