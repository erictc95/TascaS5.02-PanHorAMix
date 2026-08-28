function SceneInformationForm({ sceneData, setSceneData }) {

    function handleChange(event) {

        const { name, value } = event.target;

        setSceneData((previousData) => ({

            ...previousData,
            [name]: value

        }));

    }

    return (

        <div className="scene-information">

            <h3>📝 Scene Information</h3>

            <input
                type="text"
                name="title"
                placeholder="Scene title"
                value={sceneData.title}
                onChange={handleChange}
            />

            <textarea
                name="description"
                placeholder="Describe your scene..."
                rows="4"
                value={sceneData.description}
                onChange={handleChange}
            />

            <select
                name="category"
                value={sceneData.category}
                onChange={handleChange}
            >

                <option value="">Select a category</option>

                <option value="Cinema">Cinema</option>

                <option value="Photography">Photography</option>

                <option value="Nature">Nature</option>

                <option value="Travel">Travel</option>

                <option value="Automotive">Automotive</option>

                <option value="Architecture">Architecture</option>

                <option value="Urban">Urban</option>

                <option value="People">People</option>

                <option value="Wildlife">Wildlife</option>

                <option value="Sports">Sports</option>

                <option value="Lifestyle">Lifestyle</option>

                <option value="Events">Events</option>

                <option value="Food">Food</option>

                <option value="Fashion">Fashion</option>

                <option value="Technology">Technology</option>

                <option value="Abstract">Abstract</option>

            </select>

            <select
                name="visibility"
                value={sceneData.visibility}
                onChange={handleChange}
            >

                <option value="">Select visibility</option>

                <option value="PUBLIC">Public</option>

                <option value="PRIVATE">Private</option>

            </select>

        </div>

    );

}

export default SceneInformationForm;