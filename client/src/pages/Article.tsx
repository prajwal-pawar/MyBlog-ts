import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  LuEye,
  LuClock,
  LuUser,
  LuMessageCircle,
  LuSend,
} from "react-icons/lu";
import dayjs from "dayjs";
import { axios, ENDPOINTS } from "../api";
import { CommentCard, Loader } from "../components";

interface Comment {
  _id: string;
  article: string;
  content: string;
  user: {
    _id: string;
    name: string;
    profileImg: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Article {
  _id: string;
  title: string;
  description: string;
  content: string;
  user: {
    _id: string;
    name: string;
  };
  views: number;
  slug: string;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

const Article = () => {
  const [article, setArticle] = useState<Article | null>(null);
  const [newComment, setNewComment] = useState<string>("");
  const [articleComments, setArticleComments] = useState<Comment[] | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);

  // get slug from url params
  const { slug } = useParams();

  // fetch article
  useEffect(() => {
    const fetchArticle = async (slug: any) => {
      setLoading(true);

      try {
        const response = await axios.get(ENDPOINTS.ARTICLES.GET_BY_SLUG(slug), {
          withCredentials: true,
        });

        console.log(response.data);

        setArticle(response.data.article);
        setArticleComments(response.data.article.comments);
      } catch (err: any) {
        console.error(err);
        toast.error(err.response.data.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle(slug);
  }, [slug]);

  // calculate article read time
  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const handleAddComment = async (articleId: any) => {
    setLoading(true);

    try {
      const response = await axios.post(
        ENDPOINTS.COMMENTS.CREATE,
        {
          content: newComment,
          article: articleId,
        },
        { withCredentials: true }
      );

      console.log(response.data);

      // update articleComments state -> add new comment to state
      setArticleComments((prevComments) => [
        ...(prevComments || []),
        response.data.comment,
      ]);

      toast.success(response.data.message);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response.data.message);
    } finally {
      setNewComment("");
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-6">
      <header className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          {article?.title}
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-6">
          {article?.description}
        </p>

        <div className="flex flex-wrap justify-center items-center space-x-2 sm:space-x-4 text-gray-500 text-sm sm:text-base">
          <div className="flex items-center space-x-2">
            <LuUser className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hover:text-black hover:underline hover:cursor-pointer transition-colors">
              <Link to={`/user/profile/${article?.user?._id}`}>
                {article?.user?.name}
              </Link>
            </span>
          </div>

          <span className="hidden sm:inline">•</span>

          <div className="flex items-center space-x-1">
            <LuClock className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{dayjs(article?.createdAt).format("DD MMM YYYY")}</span>
          </div>

          <span className="hidden sm:inline">•</span>

          <div className="flex items-center space-x-1">
            <LuEye className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{article?.views} Views</span>
          </div>

          <span className="text-xs sm:text-sm text-gray-400">
            {calculateReadTime(String(article?.content))} min read
          </span>
        </div>
      </header>

      <hr />

      <article
        className="prose prose-sm sm:prose-base prose-slate 
        prose-headings:text-gray-900 prose-headings:font-bold 
        prose-a:text-blue-600 prose-a:underline prose-a:transition 
        prose-a:duration-300 hover:prose-a:text-blue-800 
        prose-code:bg-gray-100 prose-code:rounded prose-code:px-1 
        prose-blockquote:border-l-4 prose-blockquote:border-gray-300 
        prose-blockquote:italic prose-blockquote:pl-4 
        max-w-full"
      >
        <div
          dangerouslySetInnerHTML={{ __html: String(article?.content) }}
        ></div>
      </article>

      <hr />

      {/* comment section */}
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-6 space-x-2">
          <LuMessageCircle className="w-6 h-6 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-800">
            Comments ({articleComments?.length})
          </h2>
        </div>

        {/* Comment Input */}
        <div className="mb-6 flex space-x-3">
          <div className="flex-grow">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={() => handleAddComment(article?._id)}
                disabled={loading}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <LuSend className="w-4 h-4" />
                <span>{loading ? <Loader /> : "Send"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {articleComments?.map((comment) => (
            <CommentCard
              comment={comment}
              articleComments={articleComments}
              setArticleComments={setArticleComments}
              setLoading={setLoading}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Article;
