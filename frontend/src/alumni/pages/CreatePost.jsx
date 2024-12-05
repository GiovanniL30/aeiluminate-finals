import React, { useState } from "react";

import FileUploader from "../components/FileUploader";
import Button from "../components/Button";
import { useAuthContext } from "../context/AuthContext";
import create_post from "../../assets/create_post.png";
import create_line from "../../assets/create_line.png";
import { useUploadLine, useUploadPost } from "../_api/@react-client-query/query";
import TopPopUp from "../components/TopPopUp";

import default_img from "../../assets/default-img.png";
import { useNavigate } from "react-router-dom";

const CreatePost = ({ maxCaption = 225 }) => {
  const uploadQuery = useUploadPost();
  const uploadLine = useUploadLine();

  const navigate = useNavigate();
  const [isPost, setIsPost] = useState(true);
  const [images, setImages] = useState([]);
  const { user } = useAuthContext();
  const [caption, setCaption] = useState("");

  const handleCaptionChange = (e) => {
    const { value } = e.target;

    if (value.length > maxCaption) return;

    setCaption(value);
  };

  const handleSubmit = () => {
    if (caption.length < 20) {
      alert("Caption length should be greater than 20");
      return;
    }

    if (isPost && images.length === 0) {
      alert("Please upload at least one image.");
      return;
    }

    if (isPost) {
      uploadQuery.mutate(
        { caption, images },
        {
          onSuccess: () => {
            setImages([]);
            setCaption("");
            alert("Post Uploaded successfully");
            navigate("/");
          },
        }
      );
    } else {
      uploadLine.mutate(
        { caption },
        {
          onSuccess: () => {
            setCaption("");
            alert("Line Uploaded successfully");
            navigate("/");
          },
        }
      );
    }
  };

  return (
    <div className={`w-full flex flex-col gap-10 mt-5 max-container ${uploadQuery.isPending && "pointer-events-none"}`}>
      {uploadQuery.isError && <TopPopUp text={uploadQuery.error.message} />}

      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl">Create new {isPost ? "Post" : "aeline"} </h1>
        <Button text={uploadQuery.isPending ? "Uploading..." : "Share"} otherStyle="px-10" disabled={uploadQuery.isPending} onClick={handleSubmit} />
      </div>

      <div className="flex flex-col items-start gap-5 sm:items-center text-md sm:text-xl sm:flex-row">
        <button
          onClick={() => setIsPost(true)}
          className={`flex items-center justify-center gap-2 hover-opacity ${isPost ? "text-primary_blue underline font-bold" : "text-black"}`}
        >
          <img src={create_post} alt="post" />
          <p>Create Post</p>
        </button>
        <button
          onClick={() => setIsPost(false)}
          className={`flex items-center justify-center gap-2 hover-opacity ${!isPost ? "text-primary_blue underline font-bold" : "text-black"}`}
        >
          <img src={create_line} alt="line" />
          <p>Create aeline</p>
        </button>
      </div>

      <div className="flex flex-col gap-20 md:flex-row w-full">
        {isPost && <FileUploader uploading={uploadQuery.isPending} images={images} setImages={setImages} />}

        <div className="flex flex-col gap-5 w-full">
          <div className="flex items-center gap-2">
            <img className="w-12 h-12 rounded-full object-cover" src={user.profile_picture ? user.profile_picture : default_img} alt="profile" />
            <p>{user.username}</p>
          </div>

          <div className="relative">
            <textarea
              disabled={uploadQuery.isPending}
              autoFocus={true}
              value={caption}
              onChange={handleCaptionChange}
              className="p-2 text-light_text  text-sm focus:outline-none resize-none border-b-[1px] w-full h-36"
            ></textarea>
            <p className="absolute text-sm text-light_text bottom-3 right-3">
              {caption.length}/{maxCaption}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
