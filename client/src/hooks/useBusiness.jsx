import { useEffect, useState } from "react";
import getCookie from "../utils/getCookie";

const useBusiness = () => {
  const [data, setData] = useState(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {}, []);
  const createBusiness = async (values) => {
    setError(null);
    setPending(true);
    try {
      const form = new FormData();
      Object.keys(values).forEach((key) => {
        form.append(key, values[key]);
      });
      const user = getCookie("userInfo");
      const response = await fetch(`http://localhost:3000/businesses`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const Business = await response.json();
      if (Business.error) {
        setError(Business.error);
        return null;
      }
      setData(Business);
      return Business;
    } catch (error) {
      setError(error.message);
    } finally {
      setPending(false);
    }
  };
  const getBusinesses = async () => {
    setError(null);
    setPending(true);
    try {
      const user = getCookie("userInfo");
      const response = await fetch(`http://localhost:3000/businesses`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });
      const { data } = await response.json();
      if (data.error) {
        setError(data.error);
        return null;
      }
      console.log(data);
      setData(data.rows);
      return data;
    } catch (error) {
      setError(error.message);
    } finally {
      setPending(false);
    }
  };

  return {
    createBusiness,
    getBusinesses,
    data,
    pending,
    error,
  };
};

export default useBusiness;
