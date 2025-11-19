import './app.css'
import {useState} from "react";
import showdown from "showdown";

// converter for showdown
const converter = new showdown.Converter();

export default function App() {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [output, setOutput] = useState('');

    // submit handler for form
    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        console.log("sent prompt:", prompt);

        try {
            const response = await fetch('http://localhost:3000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({prompt}),
            })

            // handle HTTP errors
            if (!response.ok) {

                // streaming response
                const reader = response.body.getReader();
                const decoder = new TextDecoder('utf-8')
                let finalResult = ""

                while (true) {
                    const {value, done} = await reader.read()
                    if (done) break

                    const chunk = decoder.decode(value, {stream: true})
                    console.log(chunk)

                    finalResult += chunk
                    setOutput(finalResult)
                }

                // empty prompt and set loading to false
                setPrompt('')
                setLoading(false)

            } else {
                console.error("Fetch error:", response.status, response.statusText);
                setOutput(`Something went wrong. Please try again.`);
                setLoading(false);
            }
        } catch (error) {
            console.error('Error:', error);

        }
    }

        return (
            <div
                className="flex flex-col items-center justify-between min-h-screen bg-gradient-to-tr from-[#0f1c34] via-[#1c2a4d] to-[#4c6ef5]">
                <main className="flex flex-col w-full max-w-5xl flex-1 p-4 my-12">
                    <div className="flex-1 overflow-y-auto mb-4 space-y-3 bg-[#1c2a4d75] p-4 rounded-2xl shadow-lg">

                        {/* output */}
                        <div className="flex justify-start mb-3">
                            <div className="px-4 py-3 max-w-[75%] rounded-2xl bg-[#22355d] text-gray-200 shadow-md">
                                <div
                                    className="prose prose-invert"
                                    dangerouslySetInnerHTML={{__html: converter.makeHtml(output)}}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* input */}
                    <form onSubmit={submitHandler} className="flex-shrink-0">
                        <div className="flex space-x-2">
                            <input
                                id="input"
                                type="text"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Write something..."
                                className="flex-1 px-4 py-2 bg-[#1c2a4d75] text-gray-300 rounded-2xl shadow-lg focus:outline-none"
                            />
                            <button type="submit" disabled={loading}
                                    className={`px-4 py-2 bg-blue-500 text-white rounded-2xl ${loading ? "opacity-50" +
                                        " cursor-not-allowed" : "hover:bg-blue-600"}`}>
                                {loading ? <p className="animate-pulse">
                                        Thinking...
                                    </p>
                                    :
                                    <p>
                                        Send
                                    </p>
                                }
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        );
    }