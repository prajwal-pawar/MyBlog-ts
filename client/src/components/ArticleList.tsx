import { LuEye, LuCalendar, LuUser } from "react-icons/lu";

interface ArticleListProps {
  article: any;
}

const ArticleList = ({ article }: ArticleListProps) => {
  return (
    <>
      <div
        key={article._id}
        className="bg-white shadow-md rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg group"
      >
        <div className="p-6">
          <h2
            className="text-xl font-bold text-gray-900 mb-3 
                  transition-colors duration-300 group-hover:text-blue-600"
          >
            {article.title}
          </h2>
          <p className="text-gray-600 mb-4">{article.description}</p>

          <div className="flex items-center justify-between text-gray-500 text-sm mt-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <LuUser size={16} className="text-gray-400" />
                <span className="font-medium">{article.user.username}</span>
              </div>
              <div className="flex items-center space-x-2">
                <LuCalendar size={16} className="text-gray-400" />
                <span>{new Date(article.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <LuEye size={16} className="text-gray-400" />
                <span>{article.views} views</span>
              </div>
            </div>
            <button
              className="px-4 py-2 bg-blue-50 text-blue-600 rounded-md 
                    hover:bg-blue-100 transition-colors duration-300"
            >
              Read More
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticleList;
