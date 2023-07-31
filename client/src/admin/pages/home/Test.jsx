import { useEffect } from "react";
import axios from 'axios'
function Test() {
  useEffect(() => {
    const uniqueId = Date.now().toString(); // Generate a unique identifier
    const testFetch = async () => {
      // const response = await fetch(
      //   // `${import.meta.env.VITE_API_URL}/businesses`,
      //   `https://jsonplaceholder.org/posts?uniqueId=${uniqueId}`, // Add the unique identifier to the request URL
      //   {
      //     method: "GET",
      //   }
      // );
      const data = await axios.get("https://jsonplaceholder.org/posts")
      console.log({response})
    };
    testFetch();
  }, []);
  return <div>Text</div>;
}

export default Test;