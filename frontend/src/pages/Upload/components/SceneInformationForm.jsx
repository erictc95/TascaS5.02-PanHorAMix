import PhamSelect from "../../../components/ui/PhamSelect";

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

            <PhamSelect
                name="category"
                value={sceneData.category}
                onChange={handleChange}
                placeholder="Select a category"
                options={[
                    { value: "Cinema", label: "Cinema" },
                    { value: "Photography", label: "Photography" },
                    { value: "Nature", label: "Nature" },
                    { value: "Travel", label: "Travel" },
                    { value: "Automotive", label: "Automotive" },
                    { value: "Architecture", label: "Architecture" },
                    { value: "Urban", label: "Urban" },
                    { value: "People", label: "People" },
                    { value: "Wildlife", label: "Wildlife" },
                    { value: "Sports", label: "Sports" },
                    { value: "Lifestyle", label: "Lifestyle" },
                    { value: "Events", label: "Events" },
                    { value: "Food", label: "Food" },
                    { value: "Fashion", label: "Fashion" },
                    { value: "Technology", label: "Technology" },
                    { value: "Abstract", label: "Abstract" }
                ]}
            />

            <PhamSelect
                name="visibility"
                value={sceneData.visibility}
                onChange={handleChange}
                placeholder="Select visibility"
                options={[
                    { value: "PUBLIC", label: "Public" },
                    { value: "PRIVATE", label: "Private" }
                ]}
            />

        </div>

    );

}

export default SceneInformationForm;