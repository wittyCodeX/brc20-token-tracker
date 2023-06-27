import config from "@config/config.json";

const Post = ({ post }) => {
  const { meta_author } = config.metadata;
  const author = post.frontmatter.author ? post.frontmatter.author : meta_author;
  return (
    <div className="post">
      
    </div>
  );
};

export default Post;
