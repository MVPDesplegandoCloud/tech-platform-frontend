import { Amplify } from 'aws-amplify';

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
      userPoolClientId: process.env.REACT_APP_COGNITO_CLIENT_ID,
      region: process.env.REACT_APP_AWS_REGION || 'us-east-1',
      identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
    },
  },
};

Amplify.configure(amplifyConfig);

export default amplifyConfig;
