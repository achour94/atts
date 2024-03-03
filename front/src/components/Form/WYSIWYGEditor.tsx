import React, { useEffect, useState } from "react";
import { ContentState, convertToRaw, EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { Box } from "@mui/material";

interface WYSIWYGEditorProps {
  onChange: (content: string) => void; // Type for onChange prop function
  value: string; // Type for the initial HTML value passed to the editor
}

const WYSIWYGEditor: React.FC<WYSIWYGEditorProps> = ({ onChange, value }) => {
  const [editorState, setEditorState] = useState<EditorState>(
    EditorState.createEmpty()
  );
  const [updated, setUpdated] = useState<boolean>(false);

  useEffect(() => {
    if (!updated && value) {
      const blocksFromHtml = htmlToDraft(value);
      if (blocksFromHtml) {
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(
          contentBlocks,
          entityMap
        );
        const newEditorState = EditorState.createWithContent(contentState);
        setEditorState(newEditorState);
      }
    }
  }, [value, updated]);

  const onEditorStateChange = (newEditorState: EditorState) => {
    setUpdated(true);
    setEditorState(newEditorState);
    onChange(draftToHtml(convertToRaw(newEditorState.getCurrentContent())));
  };

  return (
    <Box sx={{ 
      border: "1px solid #D0D5DD", 
      padding: 0,
      borderRadius: "0.5rem",
      overflow: "hidden",
    }}>
      <Editor
        spellCheck
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        wrapperClassName="wrapper-class"
        editorClassName="editor-class"
        toolbarClassName="toolbar-class"
        toolbar={{
          options: ["inline", "list", "textAlign", "fontFamily", "fontSize"],
          inline: {
            inDropdown: false,
            options: ["bold", "italic", "underline"],
          },
          list: {
            inDropdown: false,
            options: ["unordered", "ordered"],
          },
          textAlign: {
            inDropdown: false,
            options: ["left", "center", "right"],
          },
          fontFamily: {
            options: [
              "Arial",
              "Georgia",
              "Impact",
              "Tahoma",
              "Times New Roman",
              "Verdana",
            ],
          },
        }}
      />
    </Box>
  );
};

export default WYSIWYGEditor;
