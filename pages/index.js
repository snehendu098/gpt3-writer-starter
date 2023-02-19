import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import buildspaceLogo from "../assets/buildspace-logo.png";

const Home = () => {
  const [userInput, setUserInput] = useState("");

  const [apiOutput, setApiOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const callGenerateEndpoint = async () => {
    setIsGenerating(true);

    console.log("Calling OpenAI...");
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userInput:
          "Take the essay below and turn it into a tweet thread.\n\n" +
          userInput,
      }),
    });

    const data = await response.json();
    console.log(data);
    const { output } = data;
    console.log("OpenAI replied...", output.text);

    setApiOutput(`${output.text}`);
    setIsGenerating(false);
    setUserInput("");
  };

  const onUserChangedText = (event) => {
    console.log(event.target.value);
    setUserInput(event.target.value);
  };

  let outputRender = apiOutput.split("\n").map((item) => {
    if (item) {
      return item.trim();
    }
  });

  return (
    <div className="root">
      <Head>
        <title>Thread Writer AI</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Turn Your Title into Thread</h1>
          </div>
          <div className="header-subtitle">
            <h2>
              Craft Engaging and Attention-Grabbing Tweets From Your Narrative!
            </h2>
          </div>
        </div>
      </div>
      <div className="prompt-container">
        <textarea
          placeholder="start typing here"
          className="prompt-box"
          value={userInput}
          onChange={onUserChangedText}
        />
        <div className="prompt-buttons">
          <a
            className={
              isGenerating ? "generate-button loading" : "generate-button"
            }
            onClick={callGenerateEndpoint}
          >
            <div className="generate">
              {isGenerating ? (
                <span className="loader"></span>
              ) : (
                <p>Generate</p>
              )}
            </div>
          </a>
        </div>

        {apiOutput && (
          <div className="output">
            <div className="output-header-container">
              <div className="output-header">
                <h3>Output</h3>
              </div>
            </div>
            <div className="output-content">
              {outputRender.map((item, index) => (
                <p key={index}>{item}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
