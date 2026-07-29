import "./MediaCard.css";
import SceneStatus from "./SceneStatus";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "../../assets/icons/default-avatar.png";

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

                <div className="media-card-status">

                    {showVisibility ? (

                        <SceneStatus visibility={item.visibility} />

                    ) : (

                        <div
                            className="media-card-author"
                            //onClick={() => navigate(`/users/${item.username}`)} --> cambiar cuando haya perfil publico.
                        >
                            <img
                                src={item.avatarUrl || defaultAvatar}
                                alt={item.username}
                            />

                            <span>{item.username}</span>

                        </div>

                    )}

                </div>

            </div>

            <div className="media-card-content">

                <h3>{item.title}</h3>

                <p>{item.description}</p>

            </div>

        </div>

    );

}

export default MediaCard;