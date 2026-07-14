import PHInput from "../../../components/common/PHInput";

function VideoDetailsForm() {

    return (

        <div className="video-details">

            <label>Title</label>

            <PHInput
                type="text"
                placeholder="Enter the video title"
            />

            <label>Description</label>

            <textarea
                rows="5"
                placeholder="Tell viewers about your story..."
            ></textarea>

            <label>Category</label>

            <select>

                <option value="">
                    Select Category
                </option>

            </select>

        </div>

    );

}

export default VideoDetailsForm;