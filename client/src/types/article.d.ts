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
  createdAt: string;
  updatedAt: string;
}

export default Article;
