import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  DeleteOutline,
} from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import SubdirectoryArrowLeftIcon from "@mui/icons-material/SubdirectoryArrowLeft";
import {
  Box,
  Divider,
  IconButton,
  Typography,
  useTheme,
  InputBase,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost, setPosts } from "state";
import UserImage from "../../components/UserImage";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
}) => {
  const [isComments, setIsComments] = useState(false); //this will determine if we open the comments list
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]); //checks whether the userId is there in Likes map, if it is there it means the user has liked the post else not
  const likeCount = Object.keys(likes).length; // the length of the likes map will be our no of likes the post has
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;
  const firstName = useSelector((state) => state.user.firstName);
  const loggedInPicture = useSelector((state) => state.user.picturePath);

  //   function that will change the number of likes
  const patchLike = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });

    const updatedPost = await response.json(); //getting the updated post from the backend
    dispatch(setPost({ post: updatedPost })); //updating the post
  };

  const addComment = async () => {
    const response = await fetch(
      `http://localhost:3001/posts/${postId}/comment`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: loggedInUserId,
          username: firstName,
          comment: comment,
          userPicture: loggedInPicture, // Include the user's picture path
        }),
      }
    );
    // console.log(response);
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
    setComment("");
  };

  const deletePost = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const getResponse = await fetch("http://localhost:3001/posts", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await getResponse.json();
    dispatch(setPosts({ posts: data }));
  };

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />

      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>

      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:3001/assets/${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          {/* likes */}
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            {likeCount > 0 && <Typography>{likeCount}</Typography>}
          </FlexBetween>

          {/* comments */}
          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            {comments.length > 0 && <Typography>{comments.length}</Typography>}
          </FlexBetween>
        </FlexBetween>

        {loggedInUserId === postUserId && (
          <IconButton onClick={deletePost}>
            <DeleteOutline />
          </IconButton>
        )}
      </FlexBetween>
      {isComments && (
        <Box mt="0.5rem">
          <Box sx={{ flexDirection: "row", gap: "1rem" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                paddingBottom: "0.5rem",
              }}
            >
              <InputBase
                placeholder="Write a comment"
                onChange={(e) => setComment(e.target.value)}
                value={comment}
                sx={{
                  width: "100%",
                  backgroundColor: palette.neutral.light,
                  borderRadius: "2rem",
                  padding: "0.5rem 1rem",
                }}
              />
              <IconButton onClick={addComment}>
                <SubdirectoryArrowLeftIcon sx={{ fontSize: "30px" }} />
              </IconButton>
            </Box>
            {Array.isArray(comments) &&
              comments.map((comment) => (
                <Box key={comment._id}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      padding: "0.25rem 0rem",
                    }}
                  >
                    <UserImage image={comment.userPicture} size="30px" />
                    <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                      {comment.name}
                    </Typography>
                    <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                      {comment.comment}
                    </Typography>
                  </Box>
                  <Divider />
                </Box>
              ))}
          </Box>
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
