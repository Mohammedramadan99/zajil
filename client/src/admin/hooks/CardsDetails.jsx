import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import useSWR from "swr";
import { setCard } from "../../store/CardSlice";

export const useGetCardDetails = (cardId) => {
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
      `${import.meta.env.VITE_API_URL}/card-info/${cardId}`,
      user.token,
    ],
    ([url, token]) => fetcher(url, token)
  );
  data?.data && dispatch(setCard(data.data));
  return { data, isLoading, error };
};
