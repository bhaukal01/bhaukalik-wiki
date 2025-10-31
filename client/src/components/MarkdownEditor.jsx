import React from "react";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import "../editor-fix.css";

export default function MarkdownEditor({ content, setContent }) {
  const HEIGHT = 500; // px

  return (
    <div className="md-editor-wrap h-[560px]">
      {" "}
      {/* wrapper sets real height */}
      <MDEditor
        value={content}
        onChange={setContent}
        height={HEIGHT} //
        highlightEnable={false}
        previewOptions={{ style: { fontFamily: "ui-sans-serif, system-ui" } }}
      />
    </div>
  );
}
