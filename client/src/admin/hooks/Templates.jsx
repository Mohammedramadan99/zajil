import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import useSWR from "swr";
import { setTempletes } from "../../store/templateSlice";

export const useGetTemplates = (businessId) => {
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
    [
      `${import.meta.env.VITE_API_URL}/businesses/${businessId}/card-templates`,
      user.token,
    ],
    ([url, token]) => businessId && fetcher(url, token,{
      revalidateOnFocus: false, // Disable revalidation on focus
      revalidateOnReconnect: false, // Disable revalidation on reconnect
      revalidateOnMount: false, // Prevent initial request on component mount

    })
  );
  useEffect(() => {
    if (businessId && data?.data) {
      dispatch(setTempletes(data.data));
    }
  }, [businessId, data, dispatch]);

  return { data, isLoading, error };
};
