import { useMemo } from "react";

const MessageComponent = ({
  type,
  text,
}: {
  type: "text" | "document" | "audio" | "video" | "image";
  text: string;
}) => {
  return useMemo(() => {
    switch (type) {
      case "text":
        return <span>{text}</span>;
      case "document":
        return <a href={text}>{text}</a>;
      case "audio":
        return <audio src={text} controls />;
      case "video":
        return <video className="max-h-96" autoPlay src={text} controls />;
      case "image":
        return <img src={text} alt="Image message" />;
      default:
        return <span>{text}</span>;
    }
  }, [text, type]);
};

export default MessageComponent;
