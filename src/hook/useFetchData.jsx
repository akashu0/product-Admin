// hooks/useFetchData.js
import { useState, useEffect } from "react";
import axios from "axios";

function useFetchData(apiUrl) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(apiUrl);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [apiUrl]);

  return { data, loading, error };
}

export default useFetchData;
