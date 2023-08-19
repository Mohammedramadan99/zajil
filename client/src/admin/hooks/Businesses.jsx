import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import useSWR from "swr";
import { setBusinesses } from "../../store/businessSlice";

export const getBusinesses = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const fetcher = (url, token) =>
    axios({
      method: "get",
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then((res) => res.data);

  const { data, error, isLoading } = useSWR(
    [`${import.meta.env.VITE_API_URL}/businesses`, user.token],
    ([url, token]) => fetcher(url, token)
  );
  data?.data && dispatch(setBusinesses(data.data));
  return { data, isLoading, error };
};
