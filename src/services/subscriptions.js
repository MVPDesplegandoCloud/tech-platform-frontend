import { fetchAuthSession } from 'aws-amplify/auth';

const SUBSCRIPTIONS_API_URL = process.env.REACT_APP_SUBSCRIPTIONS_API_URL
  || 'https://nd4qj5m64g.execute-api.us-east-2.amazonaws.com/v1/subscriptions';
const API_BASE_URL = SUBSCRIPTIONS_API_URL.replace(/\/subscriptions\/?$/, '');
const FEED_API_URL = process.env.REACT_APP_FEED_API_URL || `${API_BASE_URL}/feed`;

const getIdToken = async () => {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();

  if (!token) {
    throw new Error('No se encontró una sesión autenticada. Vuelve a iniciar sesión.');
  }

  return token;
};

const readResponse = async (response) => {
  if (!response.ok) {
    const responseMessage = await response.text();
    throw new Error(responseMessage || `La API respondió con el estado ${response.status}.`);
  }

  if (response.status === 204) return null;

  const responseText = await response.text();
  if (!responseText) return null;

  try {
    return JSON.parse(responseText);
  } catch {
    return responseText;
  }
};

export const getSubscriptions = async () => {
  const token = await getIdToken();
  const response = await fetch(SUBSCRIPTIONS_API_URL, {
    method: 'GET',
    headers: { Authorization: token },
  });
  const data = await readResponse(response);

  if (!Array.isArray(data?.subscriptions)) {
    throw new Error('La respuesta de la API no contiene una lista de suscripciones válida.');
  }

  return data.subscriptions;
};

export const createSubscription = async (url) => {
  const token = await getIdToken();
  const response = await fetch(SUBSCRIPTIONS_API_URL, {
    method: 'POST',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });

  return readResponse(response);
};

export const getRecommendedFeed = async () => {
  const token = await getIdToken();
  const response = await fetch(FEED_API_URL, {
    method: 'GET',
    headers: { Authorization: token },
  });
  const recommendations = await readResponse(response);

  if (!Array.isArray(recommendations)) {
    throw new Error('La respuesta de /feed no contiene una lista de recomendaciones válida.');
  }

  return recommendations;
};
