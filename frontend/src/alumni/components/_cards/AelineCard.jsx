import React from "react";

import logo from "../../../assets/logoCircle.png";

import comment from "../../../assets/comment.png";
import liked from "../../../assets/post-liked.png";
import unliked from "../../../assets/post-unliked.png";

import more_hor from "../../../assets/more_hor.png";

const AelineCard = ({ postID, caption, userID, createdAt }) => {
  return (
    <div className="flex gap-7 w-full">
      <div className="flex items-start justify-start w-14">
        <img src={logo} alt="profile" />
      </div>
      <div className="flex flex-col gap-2 mt-2">
        <p className="font-bold text-lg -mb-2">{userID}</p>
        <p className="font-thin">{caption}</p>
        <div className="flex mt-4 gap-2 items-center">
          <button className="w-5 h-5">
            <img src={unliked} alt="unliked" />
          </button>
          <button className="w-5 h-5">
            <img src={comment} alt="comment" />
          </button>
        </div>
        <button className="w-fit text-sm text-light_text">
          <p>2 replies</p>
        </button>
      </div>
      <div className="flex items-start justify-center gap-2 ml-auto mt-2">
        <div className="flex gap-2">
          <p className="text-sm text-light_text">50 m</p>
          <button className="flex items-center justify-center">
            <img src={more_hor} alt="dots" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AelineCard;
