import { signOut } from "next-auth/react";

export default function Chat(): JSX.Element {
  return <div>
    <h1>Chat</h1>
    <button onClick={() => signOut()}>Logout</button>
  </div>;
}
