import { RaisedButton, Message } from "@/components";
import { useContext, useEffect, useState } from "react";
import { FirebaseContext } from "@/firebase/firebase.context";
import { useRouter } from "next/router";

export default function Chat() {
  const [messageContent, setMessageContent] = useState("");
  const { user, signout, sendMessage, messages } = useContext(FirebaseContext);
  const router = useRouter();
  useEffect(() => {
    if (!user) router.push("/login");
  }, [user]);

  if (!user) return null;

  const handleSubmit = async e => {
    e.preventDefault();
    await sendMessage(messageContent);
    setMessageContent("");
  };

  return (
    <div className="chat container">
      <div className="sider">
        <div>
          <img
            src={user.photoURL}
            alt={user.displayName}
            className="sider-avatar"
          />
          <h2>{user.displayName}</h2>
          <h3>{user.email}</h3>
        </div>
        <RaisedButton onClick={signout}>LOGOUT</RaisedButton>
      </div>
      <div className="content">
        <div className="message-container">
          {messages.map(message => (
            <Message
              key={message.id}
              message={message}
              isOwnMessage={message.user.id === user.uid}
            />
          ))}
        </div>
        <form className="input-container" onSubmit={handleSubmit}>
          <input
            placeholder="Enter your message here"
            value={messageContent}
            onChange={e => setMessageContent(e.target.value)}
          />
          <RaisedButton type="submit">SEND</RaisedButton>
        </form>
      </div>
    </div>
  );
}