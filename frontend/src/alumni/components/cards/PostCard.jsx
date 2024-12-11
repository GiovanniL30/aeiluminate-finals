import React, { useState } from "react";
import { timeAgo } from "../../../utils.js";

import logo from "../../../assets/logoCircle.png";

import comment from "../../../assets/comment.png";
import liked from "../../../assets/post-liked.png";
import unliked from "../../../assets/post-unliked.png";
import more_vert from "../../../assets/more_vert.png";

import ImageCarousel from "../posts/ImageCarousel.jsx";
import DeletePost from "../posts/DeletePost.jsx";
import { ReadMore } from "../ReadMore";
import {
  useGetUser,
  useGetUserPosts,
  useLikePost,
  usePostInformation,
  useUnlikePost,
  useUserFollower,
  useUserFollowing,
} from "../../_api/@react-client-query/query.js";
import PostCardLoading from "./loaders/PostCardLoading.jsx";
import CommentPopUp from "./CommentPopUp.jsx";
import { NavLink } from "react-router-dom";
import UserProfilePic from "../UserProfilePic.jsx";
import { useAuthContext } from "../../context/AuthContext.jsx";

const PostCard = ({ postID, caption, images, userID, createdAt, otherStyle }) => {
  const [isDelete, setIsDelete] = useState(false)
  const [isShowComment, setIsShowComment] = useState(false);
  const likePostQuery = useLikePost();
  const unlikePostQuery = useUnlikePost();
  const { isLoading, isError, data } = usePostInformation(postID);
  const { user } = useAuthContext();

  if (isLoading) {
    return <PostCardLoading />;
  }


  const handleLike = () => {
    if (data.is_liked == 1) {
      unlikePostQuery.mutate(postID);
    } else {
      likePostQuery.mutate(postID);
    }
  };

  return (
    <div className={`h-fit w-full flex flex-col gap-5 p-3 rounded-xl my-shadow ${isShowComment && "pointer-events-none"} ${otherStyle}`}>
      {isShowComment && (
        <CommentPopUp
          postId={postID}
          profilePic={data.profile_link}
          handleLike={handleLike}
          images={images}
          userID={userID}
          userName={data.posted_by}
          setIsShowComment={setIsShowComment}
          caption={caption}
          isLiked={data.is_liked}
          likes={data.total_likes}
        />
      )}

      <div className="flex flex-col sm:flex-row justify-between pt-4 px-4">
        <div className="relative flex items-center gap-2 sm:gap-6">
          <UserProfilePic userID={userID} profile_link={data.profile_link} />
          <p className="font-semibold">
            {data.posted_by}
            {user.userID === userID && <span className="text-primary_blue ml-1">(YOU)</span>}
          </p>
        </div>

        <div className="flex gap-3 items-center justify-between sm:justify-center mt-2 sm:mt-0 relative">
          <p className="text-sm text-light_text">{timeAgo(createdAt)}</p>
          <div>

          <button onClick={() => setIsDelete(true)} className="w-5 h-5 flex justify-center">
            <img className="w-1 h-4" src={more_vert} alt="dots" />
          
          </button>
          {isDelete && <DeletePost setIsDelete={setIsDelete} />}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 h-fit max-h-[500px] min-h-[250px]">
        <ImageCarousel images={images} />
      </div>

      <div className="flex flex-col gap-3 py-2">
        <div className="flex items-center gap-6">
          <button className="w-6 h-6" onClick={handleLike}>
            <img src={data.is_liked == 1 ? liked : unliked} alt="like/unlike" />
          </button>
          <button className="w-6 h-6" onClick={() => setIsShowComment(true)}>
            <img src={comment} alt="comment" />
          </button>
        </div>

        <div className="flex flex-col gap-2  flex-grow">
          <div className="flex gap-2">
            <p className="font-bold text-sm">{data ? data.total_likes : "0"} likes</p>
            <p className="font-bold text-sm">{data ? data.total_replies : "0"} comments</p>
          </div>
          <ReadMore text={caption} id={postID} />
        </div>
      </div>
    </div>
  );
};

export default PostCard;
