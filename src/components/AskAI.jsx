import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

const GOOGLE_GEMINI_API_KEY = import.meta.env.VITE_GOOGLE_GEMINI_API;

function AskGemini() {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");

    const ask = (userInput) => {
        fetch("https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" + GOOGLE_GEMINI_API_KEY, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: userInput }] }]
            })
        }).then(response => response.json()).then(data => {
            if (data?.candidates[0]?.content?.parts[0]?.text) {
                setAnswer(data.candidates[0].content.parts[0].text);
            } else {
                setAnswer("No response received.");
            }
        }).catch(error => setAnswer("Error fetching response: " + error.message));
    }

    function handleQuestion(event) {
        setQuestion(event.target.value);
    }

    function submitQuestion(event) {
        event.preventDefault()
        setAnswer("Thinking...")
        ask(question)
    }


    return (
        <>
            <div className="p-3">
                <div className="row">
                    <div className="col-sm-6">
                        <h2 className="mb-2 text-white">Ask Gemini...</h2>
                        <input type="text" className="userInput mb-3 text-white" value={question} onChange={handleQuestion} placeholder="Type your question..." />
                        <button className="btn btn-primary" onClick={submitQuestion}>Ask</button>
                    </div>
                    <div className="p-2 col-sm-6 text-white">
                        <ReactMarkdown>{answer}</ReactMarkdown>
                        {/* {answer} */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default AskGemini