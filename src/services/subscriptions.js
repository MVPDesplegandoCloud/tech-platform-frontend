import { fetchAuthSession } from 'aws-amplify/auth';

const SUBSCRIPTIONS_API_URL = process.env.REACT_APP_SUBSCRIPTIONS_API_URL
  || 'https://nd4qj5m64g.execute-api.us-east-2.amazonaws.com/v1/subscriptions';

export const createSubscription = async (url) => {
  const session = await fetchAuthSession();
  const token = session.tokens?.accessToken?.toString();

  if (!token) {
    throw new Error('No se encontró una sesión autenticada. Vuelve a iniciar sesión.');
  }

  const response = await fetch(SUBSCRIPTIONS_API_URL, {
    method: 'POST',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    const responseMessage = await response.text();
    throw new Error(responseMessage || `No se pudo guardar la suscripción (${response.status}).`);
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
