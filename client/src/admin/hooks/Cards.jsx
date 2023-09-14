import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import useSWR from "swr";
import { setCards } from "../../store/CardSlice";
export const useGetCards = (businessId) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  // const { businesses } = useSelector((state) => state.businesses);

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
      `${import.meta.env.VITE_API_URL}/businesses/${businessId}/cards`,
      user.token,
    ],
    ([url, token]) => businessId && fetcher(url, token)
  );
  data?.data && dispatch(setCards(data.data));
  return { data, isLoading, error };
};
