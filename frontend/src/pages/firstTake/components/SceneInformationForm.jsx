function SceneInformationForm() {

    return (

        <div className="scene-information">

            <h3>📝 Scene Information</h3>

            <input
                type="text"
                placeholder="Scene title"
            />

            <textarea
                placeholder="Describe your scene..."
                rows="4"
            />

            <select>

                <option value="">Select a category</option>

                <option>Cinema</option>

                <option>Photography</option>

                <option>Nature</option>

                <option>Travel</option>

                <option>Automotive</option>

            </select>

            <select>

                <option value="">Select visibility</option>

                <option>Public</option>

                <option>Private</option>

            </select>

        </div>

    );

}

export default SceneInformationForm;