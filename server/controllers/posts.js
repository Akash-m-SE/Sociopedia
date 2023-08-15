import Post from "../models/Post.js";
import User from "../models/User.js";

// CREATE
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();

    const post = await Post.find();

    res.status(201).json(post);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (post) {
    await Post.findByIdAndDelete(id);
    const response = await Post.find({});
    res.status(200).json(response);
  } else {
    res.status(404).json({ message: "Post not found" });
  }
};

// READ
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find({}).sort({ createdAt: -1 });
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// UPDATE
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    // like is like a dictionary with userid as key and true as value. We are checking if the userId exists in like dict or not
    // if the userId exists then our isLiked will be true indicating it exists, so we simply delete the userId from our likes dict else we
    // add the userId to our likes dict and set its val to be true indicating that the user has liked the post
    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// adding comments
export const addComment = async (req, res) => {
  const { id } = req.params;
  const { userId, username, comment, userPicture } = req.body;
  const post = await Post.findById(id);

  if (post) {
    const commentCreated = {
      user: userId,
      name: username,
      comment: comment,
      userPicture: userPicture,
    };
    post.comments.push(commentCreated);

    post.numOfComments = post.comments.length;
    await post.save();
    res.status(200).json(post);
  } else {
    res.status(404).json({ message: error.message });
  }
};
