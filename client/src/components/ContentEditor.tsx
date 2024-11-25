import { Dispatch, SetStateAction } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface ContentEditorProps {
  content: string;
  setContent: Dispatch<SetStateAction<string>>;
}

const ContentEditor = ({ content, setContent }: ContentEditorProps) => {
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  return (
    <ReactQuill
      value={content}
      onChange={setContent}
      modules={quillModules}
      placeholder="Write your article here ....."
      className="h-64 sm:h-80 text-xs sm:text-base"
    />
  );
};

export default ContentEditor;
