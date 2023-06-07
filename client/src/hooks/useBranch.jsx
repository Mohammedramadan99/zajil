import { useEffect, useState } from "react";
import getCookie from "../utils/getCookie";

const useBranch = () => {
  const [data, setData] = useState(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {}, []);
  const createBranch = async (values) => {
    setError(null);
    setPending(true);
    try {
      const form = new FormData();
      Object.keys(values).forEach((key) => {
        form.append(key, values[key]);
      });
      const user = getCookie("userInfo");
      const response = await fetch(`http://localhost:3000/branches`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const branch = await response.json();
      if (branch.error) {
        setError(branch.error);
        return null;
      }
      setData(branch);
      return branch;
    } catch (error) {
      setError(error.message);
    } finally {
      setPending(false);
    }
  };

  return {
    createBranch,

    data,
    pending,
    error,
  };
};

export default useBranch;
