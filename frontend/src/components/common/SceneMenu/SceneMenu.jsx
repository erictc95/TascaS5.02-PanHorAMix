import "./SceneMenu.css";
import {useState} from "react";
import phamStudioIcon from "../../../assets/icons/pham-studio-icon.png";
import phamEditIcon from "../../../assets/icons/pham-edit-icon.png";
import phamDeleteIcon from "../../../assets/icons/pham-delete-icon.png";
import publicSceneIcon from "../../../assets/icons/public-scene-icon.png";
import privateSceneIcon from "../../../assets/icons/private-scene-icon.png";

function SceneMenu({item, onDelete}) {

    const [open, setOpen] = useState(false);

    const toggleMenu = (e) => {
        e.stopPropagation();
        setOpen(!open);
    };

    return (

        <div className="scene-menu">

            <button
                className="scene-menu-button"
                onClick={toggleMenu}
            >

                <img
                    src={phamStudioIcon}
                    alt="PHAM Studio"
                />

            </button>

            {open && (

                <div className="scene-menu-panel">

                    <button className="scene-action">

                        <img
                            src={phamEditIcon}
                            alt="Edit Scene"
                        />

                        <span>

                            <strong>Edit Scene</strong>

                            <small>
                                Modify title, description and category
                            </small>

                        </span>

                    </button>

                    <button className="scene-action">

                        <img
                            src={
                                item.visibility === "PUBLIC"
                                    ? privateSceneIcon
                                    : publicSceneIcon
                            }
                            alt="Visibility"
                        />

                        <span>

                            <strong>

                                {item.visibility === "PUBLIC"
                                ? "Make Private"
                                : "Make Public"}

                            </strong>

                            <small>

                                {item.visibility === "PUBLIC"
                                ? "Only visible to you"
                                : "Visible to everyone"}

                            </small>

                        </span>

                    </button>

                    <button className="scene-action"
                            onClick={onDelete}
                    >

                        <img
                            src={phamDeleteIcon}
                            alt="Delete Scene"
                        />

                        <span>

                            <strong>Delete Scene</strong>

                            <small>
                                Permanently remove this scene
                            </small>

                        </span>

                    </button>

                </div>

            )}

        </div>

    );

}

export default SceneMenu;