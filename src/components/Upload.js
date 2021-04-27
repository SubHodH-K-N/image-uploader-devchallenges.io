import image from "../image.svg";
import { useState, useRef } from "react";
import axios from "axios";
import Progress from "./Progress";
import Message from "./Message";

const Upload = () => {
  const fileInput = useRef(null);
  const [imageInput, setImageInput] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [upload, setUpload] = useState(false);
  const [uploadedURL, setUploadedURL] = useState("");
  const [uploadClicked, setUploadClicked] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [showMessage, setShowMessage] = useState(false);

  const handleFile = (file) => {
    if (
      ["png", "jpg", "jpeg"].includes(file.name.split(".")[1].toLowerCase())
    ) {
      setImageInput(imageInput);

      const reader = new FileReader();
      if (file) {
        reader.readAsDataURL(file);
        reader.onload = () => {
          setPreviewUrl(reader.result);
          setUpload(true);
        };
      }
      setShowMessage(false);
    } else {
      setUpload(false);
      setShowMessage(true);
    }
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    let imageFile = e.dataTransfer.files[0];
    handleFile(imageFile);
  };

  const handleUpload = async () => {
    setUploadClicked(true);
    let res = await axios.post(
      "https://gentle-island-09936.herokuapp.com/images",
      JSON.stringify({ image: previewUrl }),
      {
        headers: { "Content-Type": "application/json" },
        onUploadProgress: (progressEvent) => {
          setPercentage(
            Math.floor((progressEvent.loaded * 100) / progressEvent.total)
          );
        },
      }
    );

    let data = await res.data;
    setUploadedURL(data.url);
  };

  return (
    <>
      {!uploadClicked ? (
        <>
          <h1>Upload your image</h1>
          <p>File should be Jpeg or Png...</p>
          <div className="dnd-container">
            <div
              className="dragndrop"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <img
                src={!previewUrl ? image : previewUrl}
                alt="upload-here"
                width={115}
                height={90}
              />
              <p>Drag & Drop your image here</p>
              <input
                type="file"
                accept=".png, .jpeg, .jpg"
                ref={fileInput}
                hidden
                onChange={(e) => handleFile(e.target.files[0])}
              />
            </div>
            <p>Or</p>
          </div>
          <button
            onClick={upload ? handleUpload : () => fileInput.current.click()}
          >
            <input
              type="file"
              accept=".png, .jpeg, .jpg"
              ref={fileInput}
              hidden
              onChange={(e) => handleFile(e.target.files[0])}
            />
            {upload ? "Upload" : "Choose a file"}
          </button>
        </>
      ) : uploadedURL === "" ? (
        <Progress percentage={percentage} />
      ) : (
        <>
          <span className="material-icons">check_circle</span>
          <h1>Uploaded Successfully</h1>
          <img src={uploadedURL} alt="uploaded" className="dnd-container img" />
          <div className="image-link">
            <span id="url">{uploadedURL.substring(0, 54)}...</span>
            <button
              className="copy-link"
              onClick={() => {
                const textarea = document.createElement("textarea");
                textarea.textContent = uploadedURL;
                document.body.appendChild(textarea);
                textarea.select();
                try {
                  document.execCommand("copy");
                } catch (error) {
                  console.error(error);
                } finally {
                  document.body.removeChild(textarea);
                }
              }}
            >
              Copy Link!
            </button>
          </div>
        </>
      )}
      {showMessage && (
        <Message color={"red"} message={"Invalid File Format!"} />
      )}
    </>
  );
};

export default Upload;
