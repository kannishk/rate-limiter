import { useState } from "react";
import axios from "axios";

const App = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/data");
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err.response ? err.response.data.error : "An error occurred");
    }
  };

  return (
    <div>
      <h1>API Rate Limiting and Throttling</h1>
      <button onClick={fetchData}>Fetch Data</button>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default App;
