import "./MediaCard.css";
import SceneStatus from "./SceneStatus";
import { useNavigate } from "react-router-dom";

function MediaCard({ item, showVisibility = false }) {

    const navigate = useNavigate();


    return (

        <div className="media-card">

            <div className="media-card-media" onClick={() => navigate(`/media/${item.id}`)}>

                {item.mediaType === "IMAGE" ? (

                    <img
                        src={item.mediaUrl}
                        alt={item.title}
                    />

                ) : (

                    <video controls>

                        <source src={item.mediaUrl} />

                    </video>

                )}

                {showVisibility && (

                    <div className="media-card-status">

                        <SceneStatus visibility={item.visibility} />

                    </div>

                )}

            </div>

            <div className="media-card-content">

                <h3>{item.title}</h3>

                <p>{item.description}</p>

            </div>

        </div>

    );

}

export default MediaCard;