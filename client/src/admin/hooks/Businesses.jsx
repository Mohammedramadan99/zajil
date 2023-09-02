import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import useSWR from "swr";
import { setBusinesses, setCreateBusiness } from "../../store/businessSlice";

export const useGetBusinesses = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const fetcher = (url, token) =>
    axios({
      method: "get",
      url,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then((res) => res.data);

  const { data, error, isLoading } = useSWR(
    [`${import.meta.env.VITE_API_URL}/businesses`, user.token],
    ([url, token]) => fetcher(url, token),
    {
      revalidateOnFocus: false, // Disable revalidation on focus
      revalidateOnReconnect: false, // Disable revalidation on reconnect
    }
  );

  useEffect(() => {
    if (data?.data) {
      dispatch(setBusinesses(data.data));
    }
  }, [data, dispatch]);

  return { data, isLoading, error };
};