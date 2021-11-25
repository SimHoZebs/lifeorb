
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import readFirebaseConfig from "../api/connectToFirebase";
import { initializeApp } from "firebase/app";
import readUser from "../api/readUser";
import createUser from "../api/createUser";

export default async function authentication() {
  console.log("it works");

  try {
    const firebaseConfig = await readFirebaseConfig();
    if (typeof firebaseConfig === "string") {
      return firebaseConfig;
    }
    initializeApp(firebaseConfig);

    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    const googleUser = result.user;
    if (!googleUser.displayName) {
      throw new Error("user has no display name");
    }

    let user: Awaited<ReturnType<typeof readUser>>;
    user = await readUser(googleUser.uid);
    if (user === null) {
      user = await createUser(googleUser.uid, googleUser.displayName);
    }
    return user;

  } catch (error) {
    return error instanceof Error ? error.message : JSON.stringify(error, null, 2);
  }
}