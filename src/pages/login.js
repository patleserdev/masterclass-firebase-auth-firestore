import { RaisedButton } from "@/components";
import { useContext, useEffect } from "react";
import { FirebaseContext } from "@/firebase/firebase.context";
import { useRouter } from "next/router";

export default function Login() {
  const { signin, user } = useContext(FirebaseContext);
  const router = useRouter();

  useEffect(() => {
    if (user) router.push("/chat");
  }, [user]);

  return (
    <div className="login container">
      <RaisedButton size="large" onClick={() => signin("google")}>
        GOOGLE LOGIN
      </RaisedButton>

    </div>
  );
}
