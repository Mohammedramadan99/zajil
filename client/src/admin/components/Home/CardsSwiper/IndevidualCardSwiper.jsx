import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
// import "swiper/css/effect-fade";
import "swiper/css/effect-flip";
// import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  Autoplay,
  EffectCards,
  EffectCoverflow,
  EffectCreative,
  EffectCube,
  EffectFade,
  EffectFlip,
  Navigation,
  Pagination,
} from "swiper";
import { useSelector } from "react-redux";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import ShowCard from "../../CardControl/ShowCard";

function IndevidualCardSwiper() {
  const theme = useTheme();
  const { cards } = useSelector((state) => state.stats);
  const params = {
    // spaceBetween: 30,
    centeredSlides: true,
    slidesPerGroup: 1,
    autoplay: {
      delay: 1000,
      disableOnInteraction: true,
    },
    breakpoints: {
      // when window width is >= 640px
      400: {
        slidesPerView: 1,
        spaceBetween: 5,
      },
      // when window width is >= 768px
      768: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
    },
    loop: true,
  };

  return (
    <>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}>
        <Typography
          variant="body1"
          sx={{ p: 2, color: theme.palette.primary[300] }}>
          Cards
        </Typography>
        <Box sx={{ width: "150px", m: 2 }}></Box>
      </Stack>
      <Swiper
        {...params}
        modules={[Autoplay, EffectFlip, Pagination, Navigation]}
        navigation={true}
        effect="flip">
        {cards?.map((item, i) => (
          <SwiperSlide
            key={item._id}
            style={{
              justifyContent: "space-between",
              paddingBlock: "2rem",
            }}>
            {/* <Link
              to={`/news/${item._id}`}
              onClick={() => window.scrollTo(0, 0)}>
              <span>{dayjs(item.createdAt).fromNow()}</span>

              <h1> {item.title} </h1>
              <div
                dangerouslySetInnerHTML={{
                  __html: item.article.substring(0, 200),
                }}></div>
              <span> -{item.writtenBy} </span>
            </Link> */}
            {item?.cardTemplate && (
              <ShowCard control={true} template={item} stats={true} />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}

export default IndevidualCardSwiper;
