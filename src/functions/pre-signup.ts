import { Handler, PreSignUpExternalProviderTriggerEvent } from 'aws-lambda';
import {
  CognitoIdentityProviderClient,
  AdminGetUserCommand,
  AdminLinkProviderForUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';

const client = new CognitoIdentityProviderClient();

/**
 * The Pre sign-up Lambda trigger for Cognito user pool
 * It prevent user signup from external identity providers
 * and link external accounts with existing users in the user pool
 * https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-pre-sign-up.html
 */
export const handler: Handler<PreSignUpExternalProviderTriggerEvent> = async (
  event,
) => {
  if (event.triggerSource !== 'PreSignUp_ExternalProvider') {
    event.response.autoConfirmUser = true;
    return event;
  }

  // process when user sign up with external provider (Google)
  const email = event.request.userAttributes.email;
  const userPoolId = event.userPoolId;
  try {
    // Check if the user exists in the user pool
    await client.send(
      new AdminGetUserCommand({
        UserPoolId: userPoolId,
        Username: email,
      }),
    );

    // If user is found, link profile and allow the sign-up
    const googleUserId = event.userName.replace('Google_', '');
    await client.send(
      new AdminLinkProviderForUserCommand({
        UserPoolId: userPoolId,
        DestinationUser: {
          ProviderName: 'Cognito',
          ProviderAttributeValue: email,
        },
        SourceUser: {
          ProviderName: 'Google',
          ProviderAttributeName: 'Cognito_Subject',
          ProviderAttributeValue: googleUserId,
        },
      }),
    );
    event.response.autoConfirmUser = true;
  } catch (error) {
    if (error.code === 'UserNotFoundException') {
      // If user is not found, deny the sign-up
      throw new Error('User does not exist in the user pool.');
    }

    // Handle other errors
    throw error;
  }

  return event;
};
