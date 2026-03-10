import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, provider } from "../firebase";

const googleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, provider);

    const user = result.user;
    
    // Get the Google Access Token
    const credential = GoogleAuthProvider.credentialFromResult(result);

    console.log(user);

  } catch (error) {
    console.log(error);
  }
};

export default googleLogin;