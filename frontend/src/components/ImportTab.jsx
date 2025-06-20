import { useState } from "react";

export default function ImportTab({ user }) {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [metadata, setMetadata] = useState(null);
    const [url, setUrl] = useState("");

    const handleSave = async () => {
        const idToken = localStorage.getItem("idToken");

        try{
            const res = await fetch("http://localhost:8000/api/import/save/" , {
                method : "POST" , 
                headers: {
                    "Content-Type": "application/json",
                },
                body : JSON.stringify({
                    idToken : idToken,
                    metadata : {
                        ...metadata,
                        url : url,
                        channelTitle: "LoveBabbar",
                    },
                }),
            });

            const result = await res.json();
            alert(result.message || result.error);
        }
        catch ( err ){
            alert("Save failed: " + err.message);
        }
    };

    const handleFetch = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("http://localhost:8000/api/import/fetch-metadata/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user?.token}`,
                },
                body: JSON.stringify({ url }),
            });

            if (res.ok) {
                setMetadata(await res.json());
            }
            else {
                setError(data.error || "Failed to fetch metadata. Please check the URL or try again later.");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h3 className="text-xl font-semibold mb-6">📥 Import YouTube Video or Playlist</h3>

            <div className="mb-4">
                <input type="text" className="w-full p-2 border border-gray-400 rounded" value={url} placeholder="Paste your youtube video/playlist url here" onChange={(e) => setUrl(e.target.value)} />
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                    onClick={handleFetch}
                    disabled={!url || loading}>
                    {loading ? "Fetching..." : "Fetch Info"}
                </button>

                {error && (
                    <div className="mt-4 text-red-500">
                        ⚠️ {error}
                    </div>
                )}
                {metadata && (
                    <div className="mt-6 p-4 border rounded shadow">
                        <h4 className="text-lg font-semibold mb-2">{metadata.title}</h4>
                        <img src={metadata.thumbnail} alt="Thumbnail" className="w-64 rounded" />
                        <p className="mt-2 text-gray-600">{metadata.description}</p>

                        <button
                            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            onClick={handleSave}
                        >
                            Save to My Learning
                        </button>
                    </div>
                )}
            </div>
        </div>

    )
};