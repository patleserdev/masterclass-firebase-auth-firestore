import "@/styles/globals.css";
import "sanitize.css";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,

} from "firebase/auth";
import {
  getFirestore,
  addDoc,
  collection,
  query,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { firebaseConfig } from "@/firebase/config";
import { FirebaseContext } from "@/firebase/firebase.context";
import { useEffect, useState } from "react";

const authProviders = {
  google: new GoogleAuthProvider(),

};

export default function App({ Component, pageProps }) {
  const [auth, setAuth] = useState(null);
  const [db, setDb] = useState(null);
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const app = initializeApp(firebaseConfig);
    setAuth(getAuth(app));
    setDb(getFirestore(app));
  }, []);

  useEffect(() => {
    if (auth) {
      const unsubscribe = auth.onAuthStateChanged(data => {
        console.log(data);
        setUser(data);
      });

      return () => {
        unsubscribe();
      };
    }
  }, [auth]);

  useEffect(() => {
    if (db) {
      const q = query(collection(db, "messages"), orderBy("sentAt"));
      const unsubscribe = onSnapshot(q, data => {
        const messages = data.docs.map(doc => {
          const data = doc.data();
          data.sentAt = data.sentAt.toDate();
          return { id: doc.id, ...data };
        });
        setMessages(messages);
      });

      return () => {
        unsubscribe();
      };
    }
  }, [db]);

  const signin = async (provider = "google") =>
    await signInWithPopup(auth, authProviders[provider.toLowerCase()]);

  const signout = async () => await signOut(auth);

  const sendMessage = async content => {
    if (!content || !user || !db) return;
    const message = {
      content,
      user: {
        id: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
      },
      sentAt: new Date(),
    };
    await addDoc(collection(db, "messages"), message);
  };

  return (
    <FirebaseContext.Provider
      value={{ signin, user, signout, sendMessage, messages }}
    >
      <Component {...pageProps} />
    </FirebaseContext.Provider>
  );
}