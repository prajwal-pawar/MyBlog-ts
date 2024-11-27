import { LuTrash2 } from "react-icons/lu";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { defaultUserAvatar } from "../assets/images";
import useAuth from "../hooks/useAuth";
import { axios, ENDPOINTS } from "../api";

interface CommentCardProps {
  comment: any;
  articleComments: any;
  setArticleComments: any;
  setLoading: any;
}

const CommentCard = ({
  comment,
  articleComments,
  setArticleComments,
  setLoading,
}: CommentCardProps) => {
  const { user } = useAuth();

  const handleDeleteComment = async (id: any) => {
    setLoading(true);

    try {
      const response = await axios.delete(ENDPOINTS.COMMENTS.DELETE(id), {
        withCredentials: true,
      });

      console.log(response.data);

      // update articleComments state -> remove comment from state
      setArticleComments(
        articleComments.filter((comment: any) => comment._id !== id)
      );

      toast.success(response.data.message);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      key={comment._id}
      className="flex space-x-3 p-4 bg-gray-100 rounded-lg relative group"
    >
      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
        {/* <LuUser className="w-6 h-6 text-gray-600" /> */}
        <img
          src={
            comment.user.profileImg !== ""
              ? `http://localhost:8000/${comment.user.profileImg}`
              : defaultUserAvatar
          }
          alt="User avatar"
          className="w-full h-full object-cover rounded-full"
          onError={(e) => {
            let target = e.target as HTMLImageElement;
            target.src = defaultUserAvatar;
          }}
        />
      </div>
      <div className="flex-grow">
        <div className="flex items-center space-x-2 mb-1">
          <span className="font-medium text-gray-800">{comment.user.name}</span>
          <span className="text-xs text-gray-500">
            {dayjs(comment?.createdAt).format("DD MMM YYYY")}
          </span>
        </div>
        <p className="text-gray-700">{comment.content}</p>
      </div>
      {/* if user is authorized to delete the comment */}
      {user?._id === comment.user._id && (
        <button
          onClick={() => handleDeleteComment(comment._id)}
          className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <LuTrash2 className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default CommentCard;
