import { useState } from "react";
import { Chat } from "./Chat";

export function ChatLayout() {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className=" h-[calc(100dvh)] w-full">
      <Chat messages={selectedUser?.messages} selectedUser={selectedUser} />
    </div>
  );
}
