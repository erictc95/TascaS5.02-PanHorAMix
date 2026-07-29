import "./SceneStatus.css";

function SceneStatus({ visibility }) {

    const isPublic = visibility === "PUBLIC";

    return (
        <div
            className={`scene-status ${isPublic ? "public" : "private"}`}
            title={isPublic ? "Public Scene" : "Private Scene"}
        >
            {isPublic ? "🌍" : "🔒"}
        </div>
    );

}

export default SceneStatus;