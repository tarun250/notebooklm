import { useState, useEffect } from "react";
import API from "./api";

function App() {

  const [file, setFile] = useState(null);

  const [query, setQuery] = useState("");

  const [answer, setAnswer] = useState("");

  const [sources, setSources] = useState([]);

  const [collectionName, setCollectionName] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [status, setStatus] =
    useState({
      type: "",
      message: ""
    });

  useEffect(() => {

    if (!status.message) return;

    const timer = setTimeout(() => {

      setStatus({
        type: "",
        message: ""
      });

    }, 2500);

    return () => clearTimeout(timer);

  }, [status]);

  const uploadFile = async () => {

    if (!file) {

      setStatus({
        type: "error",
        message:
          "Please select a PDF, TXT or CSV file"
      });

      return;

    }

    try {

      setUploading(true);

      const formData = new FormData();

      formData.append("file", file);

      const response = await API.post(
        "/upload",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      setCollectionName(
        response.data.collectionName
      );

      setStatus({
        type: "success",
        message:
          "File uploaded successfully"
      });

    } catch (error) {

      console.log(error);

      setStatus({
        type: "error",
        message:
          error?.response?.data?.error ||
          error.message ||
          "Upload Failed"
      });

    } finally {

      setUploading(false);

    }

  };

  const askQuestion = async () => {

    if (!query) {

      setStatus({
        type: "error",
        message:
          "Please enter a question"
      });

      return;

    }

    if (!collectionName) {

      setStatus({
        type: "error",
        message:
          "Please upload a file first"
      });

      return;

    }

    try {

      setLoading(true);

      setAnswer("");

      const response =
        await API.post(
          "/chat",
          {
            query,
            collectionName
          }
        );

      setAnswer(
        response.data.answer
      );

      setSources(
        response.data.sources || []
      );

      setStatus({
        type: "success",
        message:
          "Response generated"
      });

    } catch (error) {

      console.log(error);

      setStatus({
        type: "error",
        message:
          error?.response?.data?.error ||
          error.message ||
          "Failed to get answer"
      });

    } finally {

      setLoading(false);

    }

  };

  return (

    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top,#111111 0%,#000000 55%)",
        padding: "50px 20px",
        fontFamily:
          "Inter, sans-serif",
        color: "#f5f5f5"
      }}
    >

      <div
        style={{
          maxWidth: "980px",
          margin: "0 auto",
          background:
            "rgba(10,10,10,0.92)",
          border:
            "1px solid rgba(255,255,255,0.05)",
          borderRadius: "24px",
          padding: "42px",
          backdropFilter: "blur(12px)",
          boxShadow:
            "0 0 60px rgba(0,0,0,0.7)",
          animation:
            "fadeIn 0.6s ease"
        }}
      >

        <div
          style={{
            marginBottom: "40px"
          }}
        >

          <h1
            style={{
              fontSize: "44px",
              fontWeight: "700",
              letterSpacing: "-1.5px",
              marginBottom: "12px"
            }}
          >
            NotebookLM RAG
          </h1>

          <p
            style={{
              color: "#8b8b8b",
              fontSize: "15px",
              lineHeight: "1.8",
              maxWidth: "650px"
            }}
          >
            Upload PDF, TXT or CSV
            documents and interact
            with them using semantic
            retrieval and grounded
            AI responses.
          </p>

        </div>

        {
          status.message && (

            <div
              style={{
                marginBottom: "22px",
                padding: "14px 18px",
                borderRadius: "14px",
                background:
                  status.type === "success"
                    ? "rgba(34,197,94,0.08)"
                    : "rgba(239,68,68,0.08)",
                border:
                  status.type === "success"
                    ? "1px solid rgba(34,197,94,0.18)"
                    : "1px solid rgba(239,68,68,0.18)",
                color:
                  status.type === "success"
                    ? "#4ade80"
                    : "#f87171",
                fontSize: "14px",
                animation:
                  "fadeIn 0.3s ease"
              }}
            >
              {status.message}
            </div>

          )
        }

        <div
          style={{
            background:
              "rgba(255,255,255,0.02)",
            border:
              "1px solid rgba(255,255,255,0.05)",
            borderRadius: "20px",
            padding: "26px",
            marginBottom: "28px"
          }}
        >

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              flexWrap: "wrap"
            }}
          >

            <input
              type="file"
              accept=".pdf,.txt,.csv"
              onChange={(e) =>
                setFile(
                  e.target.files[0]
                )
              }
              style={{
                color: "#b5b5b5"
              }}
            />

            <button
              onClick={uploadFile}
              disabled={uploading}
              style={{
                background:
                  uploading
                    ? "#1f1f1f"
                    : "#ffffff",
                color:
                  uploading
                    ? "#9ca3af"
                    : "#000000",
                border: "none",
                padding:
                  "13px 22px",
                borderRadius: "12px",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                transition:
                  "all 0.25s ease"
              }}
            >

              {
                uploading && (

                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      border:
                        "2px solid rgba(255,255,255,0.2)",
                      borderTop:
                        "2px solid white",
                      borderRadius:
                        "50%",
                      animation:
                        "spin 1s linear infinite"
                    }}
                  />

                )
              }

              {
                uploading
                  ? "Uploading..."
                  : "Upload File"
              }

            </button>

          </div>

          {
            file && (

              <div
                style={{
                  marginTop: "18px",
                  padding:
                    "16px 18px",
                  background:
                    "rgba(255,255,255,0.03)",
                  border:
                    "1px solid rgba(255,255,255,0.04)",
                  borderRadius:
                    "14px",
                  color: "#d4d4d4"
                }}
              >
                Selected File:
                <span
                  style={{
                    marginLeft: "8px",
                    color: "white",
                    fontWeight: "600"
                  }}
                >
                  {file.name}
                </span>
              </div>

            )
          }

        </div>

        <div
          style={{
            background:
              "rgba(255,255,255,0.02)",
            border:
              "1px solid rgba(255,255,255,0.05)",
            borderRadius: "20px",
            padding: "26px",
            marginBottom: "28px"
          }}
        >

          <textarea
            rows="5"
            placeholder="Ask a question about the uploaded document..."
            value={query}
            onChange={(e) =>
              setQuery(
                e.target.value
              )
            }
            style={{
              width: "100%",
              background:
                "rgba(255,255,255,0.02)",
              border:
                "1px solid rgba(255,255,255,0.06)",
              borderRadius: "16px",
              padding: "20px",
              color: "#f5f5f5",
              fontSize: "15px",
              resize: "none",
              outline: "none",
              lineHeight: "1.8"
            }}
          />

          <button
            onClick={askQuestion}
            disabled={loading}
            style={{
              marginTop: "20px",
              background:
                loading
                  ? "#1f1f1f"
                  : "linear-gradient(to right,#181818,#2a2a2a)",
              color: "#ffffff",
              border:
                "1px solid rgba(255,255,255,0.06)",
              padding:
                "14px 22px",
              borderRadius: "12px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              transition:
                "all 0.25s ease"
            }}
          >

            {
              loading && (

                <div
                  style={{
                    display: "flex",
                    gap: "5px"
                  }}
                >

                  <div className="dot" />
                  <div className="dot delay1" />
                  <div className="dot delay2" />

                </div>

              )
            }

            {
              loading
                ? "Generating Response"
                : "Ask Question"
            }

          </button>

        </div>

        <div
          style={{
            background:
              "rgba(255,255,255,0.02)",
            border:
              "1px solid rgba(255,255,255,0.05)",
            borderRadius: "20px",
            padding: "30px",
            marginBottom: "26px",
            animation:
              answer
                ? "fadeIn 0.4s ease"
                : "none"
          }}
        >

          <h2
            style={{
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "18px"
            }}
          >
            Answer
          </h2>

          <div
            style={{
              color: "#e5e5e5",
              lineHeight: "1.9",
              whiteSpace: "pre-wrap",
              fontSize: "15px"
            }}
          >

            {
              answer ||
              "The generated response will appear here."
            }

          </div>

        </div>

        <div
          style={{
            background:
              "rgba(255,255,255,0.02)",
            border:
              "1px solid rgba(255,255,255,0.05)",
            borderRadius: "20px",
            padding: "30px"
          }}
        >

          <h2
            style={{
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "18px"
            }}
          >
            Sources
          </h2>

          {
            sources.length === 0 ? (

              <div
                style={{
                  color: "#737373",
                  fontSize: "14px"
                }}
              >
                No sources available.
              </div>

            ) : (

              sources.map(
                (s, index) => (

                  <div
                    key={index}
                    style={{
                      background:
                        "rgba(255,255,255,0.03)",
                      border:
                        "1px solid rgba(255,255,255,0.05)",
                      borderRadius:
                        "14px",
                      padding:
                        "15px 18px",
                      marginBottom:
                        "12px",
                      color:
                        "#d4d4d4"
                    }}
                  >
                    Page {s.page}
                  </div>

                )
              )

            )
          }

        </div>

      </div>

      <style>
        {`

          @keyframes spin {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }

          @keyframes fadeIn {

            from {
              opacity: 0;
              transform: translateY(10px);
            }

            to {
              opacity: 1;
              transform: translateY(0px);
            }

          }

          .dot {

            width: 7px;
            height: 7px;
            background: white;
            border-radius: 50%;
            animation: bounce 1s infinite;

          }

          .delay1 {
            animation-delay: 0.15s;
          }

          .delay2 {
            animation-delay: 0.3s;
          }

          @keyframes bounce {

            0%,80%,100% {
              transform: scale(0.7);
              opacity: 0.5;
            }

            40% {
              transform: scale(1);
              opacity: 1;
            }

          }

          button:hover {
            transform: translateY(-1px);
          }

        `}
      </style>

    </div>

  );

}

export default App;