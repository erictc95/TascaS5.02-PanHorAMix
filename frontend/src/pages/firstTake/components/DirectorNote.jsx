import "./DirectorNote.css";

function DirectorNote({ title, message, type }) {

    if (!message) {

        return null;

    }

    return (

        <div className={`director-note ${type}`}>

            <h3>🎬 Director's Note</h3>

            <h4>{title}</h4>

            <p>{message}</p>

        </div>

    );

}

export default DirectorNote;