import "./MediaCard.css";
import { useNavigate } from "react-router-dom";
import SceneMenu from "../common/SceneMenu/SceneMenu";
import defaultAvatar from "../../assets/icons/default-avatar-icon.png";

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

                        <SceneMenu item={item} />

                    ) : (

                        <div
                            className="media-card-author"
                            onClick={(event) => {
                                event.stopPropagation();
                                navigate(`/users/${item.username}`);
                            }}
                        >
                            <img
                                src={item.avatarUrl || defaultAvatar}
                                alt={item.username}
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = defaultAvatar;
                                }}
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