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
        <div className="flex flex-col items-center justify-between min-h-screen bg-gray-100 text-gray-800">
            {/* Header */}
            <header className="w-full py-6 text-center bg-white shadow-sm">
                <h1 className="text-3xl font-bold">Programming 9</h1>
            </header>

            <main className="flex flex-col w-full max-w-2xl flex-1 p-4">
                <div className="flex-1 overflow-y-auto mb-4 space-y-3 bg-white p-4 rounded-2xl shadow">
                    <div className="flex justify-start mb-3">
                        <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-2xl max-w-[75%] shadow">
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
                            className="flex-1 px-4 py-2 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <button type="submit" disabled={loading}
                                className="px-4 py-2 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition">
                            Ask
                        </button>
                    </div>
                </form>
            </main>

            {/* footer */}
            <footer className="w-full py-3 text-center text-sm text-gray-500 border-t">
                © 2025 Built with React & Tailwind
            </footer>
        </div>
    );
}