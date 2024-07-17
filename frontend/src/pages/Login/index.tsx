import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';
import { Auth } from 'aws-amplify';
import { FcGoogle } from 'react-icons/fc';
import { ImFacebook2 } from 'react-icons/im';

const Login = () => {
  return (
    <div className="flex flex-col border p-4 space-y-4 shadow-sm rounded-lg">
      <button
        onClick={() => {
          Auth.federatedSignIn({
            provider: CognitoHostedUIIdentityProvider.Google,
          });
        }}
        className="flex bg-secondary gap-4 px-6 py-3 rounded-lg"
      >
        <FcGoogle size="32" />
        <p className="text-lg font-bold text-black">Sign In With Google</p>
      </button>
      <button
        onClick={() => {
          Auth.federatedSignIn({
            provider: CognitoHostedUIIdentityProvider.Facebook,
          });
        }}
        className="flex bg-secondary gap-4 px-6 py-3 rounded-lg"
      >
        <ImFacebook2 color="#1877F2" size="32" />
        <p className="text-lg font-bold text-black">Sign In With Facebook</p>
      </button>
    </div>
  );
};

export default Login;
