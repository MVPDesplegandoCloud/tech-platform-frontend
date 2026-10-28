import { fetchAuthSession } from 'aws-amplify/auth';

const SUBSCRIPTIONS_API_URL = process.env.REACT_APP_SUBSCRIPTIONS_API_URL
  || 'https://nd4qj5m64g.execute-api.us-east-2.amazonaws.com/v1/subscriptions';
const API_BASE_URL = SUBSCRIPTIONS_API_URL.replace(/\/subscriptions\/?$/, '');
const USER_PREFERENCES_API_URL = process.env.REACT_APP_USER_PREFERENCES_API_URL
  || `${API_BASE_URL}/interests`;

const getIdToken = async () => {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();

  if (!token) {
    throw new Error('No se encontró una sesión autenticada. Vuelve a iniciar sesión.');
  }

  return token;
};

const readResponse = async (response) => {
  const responseText = await response.text();
  let data = null;

  if (responseText) {
    try {
      data = JSON.parse(responseText);
    } catch {
      data = responseText;
    }
  }

  if (!response.ok) {
    const message = typeof data === 'object' && data?.message
      ? data.message
      : data || `La API respondió con el estado ${response.status}.`;
    throw new Error(message);
  }

  return data;
};

export const getUserInterests = async () => {
  const token = await getIdToken();
  const response = await fetch(USER_PREFERENCES_API_URL, {
    method: 'GET',
    headers: { Authorization: token },
  });
  const data = await readResponse(response);
  const interests = Array.isArray(data) ? data : data?.interests;

  if (!Array.isArray(interests)) {
    throw new Error('La respuesta de User Preferences no contiene una lista de intereses válida.');
  }

  return interests.map((interest, index) => ({
    id: String(interest.id || interest.interestId || interest.interestNormalizedName || index),
    name: interest.name || interest.interestNormalizedName || '',
    level: Number(interest.level ?? interest.interestLevel ?? 5),
  }));
};

export const createUserInterest = async ({ name, level }) => {
  const token = await getIdToken();
  const response = await fetch(USER_PREFERENCES_API_URL, {
    method: 'POST',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: name.trim(), level }),
  });
  const data = await readResponse(response);
  const interest = data?.interest || data;

  if (!interest || typeof interest !== 'object') {
    throw new Error('La respuesta de User Preferences no contiene el interés creado.');
  }

  return {
    id: String(interest.id || interest.interestId || interest.interestNormalizedName || Date.now()),
    name: interest.name || name.trim(),
    level: Number(interest.level ?? interest.interestLevel ?? level ?? 5),
  };
};
