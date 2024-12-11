import React from "react"

const DeletePost = ({setIsDelete}) => {

    return (
        <div className="flex flex-col rounded-[15%] justify-center items-center z-10 w-[120px] absolute top-[0] right-[0] bg-[white] border-[1px] border-[solid] ">
            <button className="text-[red] h-[40px]">Delete Post</button>
            <button onClick={() => setIsDelete(false)} className="h-[40px]">Cancel</button>
        </div>
    );
};

export default DeletePost;