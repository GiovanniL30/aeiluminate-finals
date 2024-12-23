import React, { useState } from "react";
import { formatDate, getTime, timeAgo } from "../../../utils.js";

import loc from "../../../assets/loc.png";
import time from "../../../assets/time.png";
import create_event from "../../../assets/create_event.png";
import category from "../../../assets/category.png";

import more_vert from "../../../assets/more_vert.png";
import { ReadMore } from "../ReadMore";
import UserProfilePic from "../UserProfilePic.jsx";
import { useAuthContext } from "../../context/AuthContext.jsx";
import Button from "../Button.jsx";
import {
  useCheckInterested,
  useDeleteEvent,
  useEventInformation,
  useGetUser,
  useMarkInterested,
  useUnmarkInterested,
} from "../../_api/@react-client-query/query.js";
import ToastNotification from "../../constants/toastNotification.js";
import PostCardLoading from "./loaders/PostCardLoading.jsx";

/**
 * A card component to represent aN Event
 *
 * @author Eugene Kyle Patano
 */
const EventCard = ({
  canBeDeleted = false,
  isReload = false,
  eventID,
  title,
  description,
  eventDateTime,
  location,
  eventType,
  createdOn,
  createdBy,
  imageUrl,
}) => {
  const [showDelete, setShowDelete] = useState(false);
  const [showInterested, setShowInterested] = useState(false);
  const { user } = useAuthContext();
  const uploader = useGetUser(createdBy);
  const interested = useCheckInterested(eventID, user.userID);
  const eventInformation = useEventInformation(eventID);
  const deleteEvent = useDeleteEvent();

  const markInterested = useMarkInterested();
  const unmarkIterested = useUnmarkInterested();

  if (uploader.isLoading || interested.isLoading || eventInformation.isLoading) {
    return <PostCardLoading />;
  }

  const isInterested = interested.data.isInterested;

  const handleClick = () => {
    if (isInterested) {
      unmarkIterested.mutate({ eventId: eventID, userid: user.userID });
    } else {
      markInterested.mutate({ eventId: eventID, userid: user.userID });
    }
  };

  const handleDelete = () => {
    deleteEvent.mutate(eventID, {
      onSuccess: () => {
        if (isReload) {
          window.location.reload();
        }
        setShowDelete(false);
        ToastNotification.success("Delete Success");
      },
      onError: (error) => {
        ToastNotification.error(error.message);
      },
    });
  };

  return (
    <div className="my-shadow p-2 rounded-md ">
      <div className="p-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <UserProfilePic userID={createdBy} profile_link={uploader.data.user.profile_picture} />
            <p className="font-bold text-md">
              {uploader.data.user.username} {user.userID == createdBy && <span className="text-primary_blue">(YOU)</span>}
            </p>
          </div>
          <div className="relative flex items-center gap-2">
            <p className="text-light_text text-sm">{timeAgo(createdOn)}</p>
            {(user.userID === createdBy || canBeDeleted) && (
              <button onClick={() => setShowDelete((prev) => !prev)}>
                <img className="w-1 h-4" src={more_vert} alt="dots" />
              </button>
            )}
            {showDelete && (
              <div className="top-10 z-50 absolute bg-white my-shadow flex flex-col items-center w-[150px] right-3 p-2 gap-2 rounded-mdl">
                <Button onClick={handleDelete} text="Delete Event" otherStyle="w-full" />
                <Button onClick={() => setShowDelete(false)} text="Cancel" otherStyle="w-full bg-red-500" />
              </div>
            )}
          </div>
        </div>
        <div className="p-5">
          <h1 className="font-bold text-md">{title}</h1>
          <div className="text-sm">
            <p>{description}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 p-5 gap-4">
          <div className="flex gap-2">
            <img className="w-5 h-5 object-contain" src={loc} alt="" />
            <p className="break-words">{location}</p>
          </div>
          <div className="flex gap-2">
            <img className="w-5 h-5 object-contain" src={category} alt="" />
            <p className="break-words">{eventType}</p>
          </div>
          <div className="flex gap-2">
            <img className="w-5 h-5 object-contain" src={create_event} alt="" />
            <p className="break-words">{formatDate(eventDateTime)}</p>
          </div>
          <div className="flex gap-2">
            <img className="w-5 h-5 object-contain" src={time} alt="" />
            <p className="break-words">{getTime(eventDateTime)}</p>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 flex justify-center h-fit max-h-[500px] min-h-[250px] hover-opacity relative">
        <a href={imageUrl} target="_blank">
          <img className="max-w-full max-h-[450px] object-contain" src={imageUrl} alt="event image" />
          {!isInterested && (
            <div className="w-full h-full bg-white absolute top-0 left-0 right-0 bottom-0 backdrop-blur-md bg-opacity-50 transition-all duration-500"></div>
          )}
        </a>
      </div>

      <button className="pt-5 pl-7 pb-2 font-bold" onClick={() => setShowInterested(true)}>
        <div>Interested Users: {eventInformation.data.length}</div>
      </button>
      {showInterested && (
        <div className="fixed bg-black bg-opacity-50 top-0 bottom-0 right-0 left-0 z-50 p-5">
          <div className="relative bg-white rounded-md w-full h-full max-w-[500px] max-h-[500px] mx-auto top-1/2 -translate-y-1/2">
            <button
              className="absolute right-4 top-4 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover-opacity"
              onClick={() => setShowInterested(false)}
            >
              &#10005;
            </button>
            <h1 className="px-5 pt-5">Intereseted Users</h1>
            <div className="flex w-full items-center justify-center h-full p-5 flex-col">
              {eventInformation.data.length == 0 && <h1 className="text-center">There are no people interested on this event</h1>}
              <div className="flex flex-col gap-3 w-full overflow-y-auto h-full">
                {eventInformation.data.map((userI, index) => (
                  <div key={index} className="flex items-center gap-2 my-shadow p-2 rounded-md w-full">
                    <UserProfilePic userID={userI.userID} profile_link={userI.profile_picture} />
                    <p>
                      {userI.username} {userI.userID == user.userID && <span className="text-primary_blue">(YOU)</span>}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex mt-3">
        <Button
          disabled={markInterested.isPending || unmarkIterested.isPending}
          onClick={handleClick}
          text={`${isInterested ? "Interested" : "Light Up"} `}
          otherStyle={`${isInterested && "!text-yellow-300 !bg-white !border-[1px] !border-yellow-300"} w-full`}
        />
      </div>
    </div>
  );
};
export default EventCard;
