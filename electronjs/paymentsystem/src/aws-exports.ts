export const pubsub = {
  aws_pubsub_region: 'eu-central-1',
  aws_pubsub_endpoint: 'wss://a3dtjrh1oco8co-ats.iot.eu-central-1.amazonaws.com/mqtt',
}

export const auth = {
  // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
  identityPoolId: 'eu-central-1:bc2800e6-e443-4fa2-9cd1-efda00815ee3',

  // REQUIRED - Amazon Cognito Region
  region: 'eu-central-1',

  // OPTIONAL - Amazon Cognito User Pool ID
  userPoolId: 'eu-central-1_uw9fILjMv',

  // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
  userPoolWebClientId: '767s22a9vjc7qopt2su5qpmv07',

  // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
  mandatorySignIn: true,
}