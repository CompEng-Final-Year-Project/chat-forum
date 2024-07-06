import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

import {
  FaFileAlt,
  FaGlobeAfrica,
  FaPhotoVideo,
  FaTimes,
} from "react-icons/fa";
import { AiFillAudio } from "react-icons/ai";
import { Textarea } from "./ui/textarea";
import { ChevronDown } from "lucide-react";
import React, { useContext, useState } from "react";
import AudioRecorder from "./AudioRecorder";
import { PostContext } from "@/contexts/PostContext";
import { RiDeleteBin6Line } from "react-icons/ri";

const CreatePostCard = () => {
  const [extra, setExtra] = useState<"Photo" | "Document" | "Audio" | null>(
    null
  );
  const { audioUrl, setAudioUrl } = useContext(PostContext);
  const [photosOrVideos, setPhotosOrVideos] = useState<File[] | null>(null);
  const maxSize = 20 * 1024 * 1024;

  const handlePhotoOrVideoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      const filteredFiles = selectedFiles.filter(
        (file) => file.size <= maxSize
      );
      if (filteredFiles < selectedFiles) {
        alert("Some files were too large and were not added");
      }
      setPhotosOrVideos((prevFiles) => [
        ...(prevFiles ?? []),
        ...filteredFiles,
      ]);
    }
  };

  const removeFile = (index: number) => {
    setPhotosOrVideos((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  let extraContent;
  switch (extra) {
    case "Photo":
      extraContent = (
        <Card className="p-3">
          {photosOrVideos ? (
            <div className="w-full mt-4 flex flex-wrap">
              {photosOrVideos?.map((file, index) => {
                return (
                  <div key={index} className="relative w-1/3 p-2">
                    <Button
                      onClick={() => removeFile(index)}
                      type="button"
                      variant={"outline"}
                      size={"icon"}
                      className="rounded-full absolute top-0 right-0 p-0 text-neutral-400 h-7 w-7"
                    >
                      <FaTimes />
                    </Button>
                    {file.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt="preview"
                        className="w-full h-auto"
                      />
                    ) : (
                      <video
                        src={URL.createObjectURL(file)}
                        controls
                        className="w-full h-auto"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <>
              <input
                type="file"
                accept="image/*, video/*"
                multiple
                className="hidden"
                id="file"
                onChange={handlePhotoOrVideoChange}
              />
              <label
                htmlFor="file"
                className="flex items-center justify-center flex-col w-full cursor-pointer"
              >
                <div className="w-full h-[10rem] hover:bg-neutral-200 bg-neutral-100 flex items-center justify-center relative">
                  <div className="flex items-center justify-center flex-col ">
                    <Button
                      onClick={() => setExtra(null)}
                      type="button"
                      variant={"outline"}
                      size={"icon"}
                      className="rounded-full absolute top-0 right-0 p-0 text-neutral-400 h-7 w-7"
                    >
                      <FaTimes />
                    </Button>
                    <Button
                      type="button"
                      variant={"ghost"}
                      className="rounded-full text-2xl p-0 h-10 w-10"
                    >
                      <FaPhotoVideo />
                    </Button>
                    <p>Add photos/videos</p>
                  </div>
                </div>
              </label>
            </>
          )}
        </Card>
      );
      break;
    case "Document":
      extraContent = (
        <Card className="p-3">
          <div className="w-full h-[10rem] cursor-pointer hover:bg-neutral-200 bg-neutral-100 flex items-center justify-center relative">
            <div className="flex items-center justify-center flex-col ">
              <Button
                onClick={() => setExtra(null)}
                type="button"
                variant={"outline"}
                size={"icon"}
                className="rounded-full absolute top-0 right-0 p-0 text-neutral-400 h-7 w-7"
              >
                <FaTimes />
              </Button>
              <Button
                type="button"
                variant={"ghost"}
                className="rounded-full text-2xl p-0 h-10 w-10"
              >
                <FaFileAlt />
              </Button>
              <p>Add document</p>
            </div>
          </div>
        </Card>
      );
      break;
    case "Audio":
      extraContent = (
        <Card className="p-3">
          <div className="w-full  flex items-center justify-center relative">
            <div className="flex items-center justify-center flex-col ">
              <Button
                type="button"
                onClick={() => setExtra(null)}
                variant={"outline"}
                size={"icon"}
                className="rounded-full absolute top-0 right-0 p-0 text-neutral-400 h-7 w-7"
              >
                <FaTimes />
              </Button>
            </div>
            <AudioRecorder />
          </div>
        </Card>
      );
      break;
    default:
      extraContent = null;
  }
  return (
    <div className="fixed top-0 left-0 flex justify-center items-center w-full h-full bg-black  bg-opacity-60 z-30">
      <Card className="z-50 w-[30rem]">
        <CardHeader>
          <CardTitle className="text-md mx-auto">Create post</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Avatar className="w-16 h-16">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col font-medium">
              <span>Marvin Asamoah</span>
              <div className=" rounded-sm text-xs cursor-pointer px-1 flex flex-row justify-start items-center w-fit  bg-zinc-300">
                <div className="flex flex-row items-center space-x-1">
                  <FaGlobeAfrica />
                  <span>Public</span>
                </div>
                <div className="">
                  <ChevronDown width={15} />
                </div>
              </div>
            </div>
          </div>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="mt-2">
                <Textarea
                  rows={5}
                  id="name"
                  placeholder="What is on your mind?"
                  className="outline-none border-none resize-none placeholder:text-xl f"
                />
                {audioUrl && (
                  <div className="w-full flex items-center space-x-3">
                    <audio controls className="w-full" src={audioUrl} />
                    <Button
                      onClick={() => setAudioUrl(null)}
                      size={"icon"}
                      className=""
                    >
                      <RiDeleteBin6Line />
                    </Button>
                    {/* <Waveform audioUrl={audioUrl} /> */}
                  </div>
                )}
              </div>
              {extraContent}

              <Card className="shadow-sm">
                <div className="flex flex-row justify-between   items-center mx-4 my-2">
                  <p className="font-semibold">Add to your post</p>
                  <div className="flex flex-row">
                    <Button
                      onClick={() => setExtra("Photo")}
                      type="button"
                      className={`rounded-full  text-xl ${
                        extra === "Photo"
                          ? "bg-neutral-200  text-black"
                          : "text-green-600"
                      }  `}
                      variant={"ghost"}
                      size={"icon"}
                    >
                      <FaPhotoVideo />
                    </Button>

                    <Button
                      onClick={() => setExtra("Document")}
                      type="button"
                      className={`rounded-full  text-xl ${
                        extra === "Document"
                          ? "bg-neutral-200  text-black"
                          : "text-green-600"
                      } p-0 m-0`}
                      variant={"ghost"}
                      size={"icon"}
                    >
                      <FaFileAlt />
                    </Button>

                    <Button
                      onClick={() => setExtra("Audio")}
                      type="button"
                      className={`rounded-full  text-xl ${
                        extra === "Audio"
                          ? "bg-neutral-200  text-black"
                          : "text-green-600"
                      }`}
                      variant={"ghost"}
                      size={"icon"}
                    >
                      <AiFillAudio />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
            <div className="flex mt-4 justify-center">
              <Button type="submit" className="w-full">
                Post
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatePostCard;
