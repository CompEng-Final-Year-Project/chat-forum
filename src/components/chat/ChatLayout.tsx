import { Chat } from "./Chat";

export function ChatLayout({type}: {type: "direct" | "course"}) {

  return (
    <div className=" h-[calc(100dvh)] w-full">
      <Chat type={type} />
    </div>
  );
}
