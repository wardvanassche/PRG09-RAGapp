import './app.css'
import {useState} from "react";

export default function App() {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [output, setOutput] = useState('');

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
                body: JSON.stringify({ prompt }),
            })

            const data = await response.json();
            console.log("received response:", data.response);

            setOutput(data.response);

        } catch (error) {
            console.error('Error:', error);
        }

        setPrompt('');
        setLoading(false);
    }

    return (
        <div className="flex flex-col items-center justify-between min-h-screen bg-gradient-to-tr from-[#0f1c34] via-[#1c2a4d] to-[#4c6ef5]">
            <main className="flex flex-col w-full max-w-5xl flex-1 p-4 my-12">
                <div className="flex-1 overflow-y-auto mb-4 space-y-3 bg-[#1c2a4d75] p-4 rounded-2xl shadow-lg">

                    {/* output */}
                    <div className="flex justify-start mb-3">
                        <div className="text-gray-300 px-4 py-2 max-w-[75%]">
                            {output}
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
                                className="px-4 py-2 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition">
                            Ask
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}