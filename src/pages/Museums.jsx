import { useParams } from "react-router-dom";

function MuseumDetail() {
  const { id } = useParams();

  return (
    <div>
      <h1>Museum Detail - ID: {id}</h1>
      {/* You can fetch or display the museum details based on the id */}
    </div>
  );
}

export default MuseumDetail;
