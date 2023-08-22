import React, { useState } from "react";
import Card from "../../components/Cards/Card/Card";
import { Box, Container, Grid, useTheme } from "@mui/material";
import CreateTemplateForm from "../../components/CreateTemplate/CreateTemplateForm";
import {useGetBusinesses} from '../../hooks/Businesses'
function CreateCard() {
  const theme = useTheme();
  const [tempPhoto, setTempPhoto] = useState("");
  const [imgColor, setImgColor] = useState("");
  const [activeImg, setActiveImg] = useState("");
  const [textLogo, setTextLogo] = useState(null);
  const [stickersNumber, setStickersNumber] = useState();
  const [logoImg, setLogoImg] = useState(null);
  const [activeIcon, setActiveIcon] = useState("");
  const [activeScanType, setActiveScanType] = useState("");
  const [name, setName] = useState("");
  const [barcode, setBarcode] = useState("");
  const [labelColor, setLabelColor] = useState(theme.palette.primary[400]);
  const [textColor, setTextColor] = useState(theme.palette.primary[400]);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [headerFieldValue, setHeaderFieldValue] = useState("");
  const [headerFieldLabel, setHeaderFieldLabel] = useState("");
  
  
  const {error,isLoading} = useGetBusinesses()
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.alt,
        paddingBlock: 4,
        // flexGrow: 1,
        minHeight: "100vh",
        pb:10
      }}>
      <Container>
        <Grid container spacing={6}>
          <Grid md={8} xs={12} item>
            <CreateTemplateForm
              tempPhoto={tempPhoto}
              setTempPhoto={setTempPhoto}
              activeImg={activeImg}
              setActiveImg={setActiveImg}
              textLogo={textLogo}
              setTextLogo={setTextLogo}
              logoImg={logoImg}
              setLogoImg={setLogoImg}
              stickersNumber={stickersNumber}
              setStickersNumber={setStickersNumber}
              activeIcon={activeIcon}
              setActiveIcon={setActiveIcon}
              name={name}
              setName={setName}
              activeScanType={activeScanType}
              setActiveScanType={setActiveScanType}
              imgColor={imgColor}
              setImgColor={setImgColor}
              barcode={barcode}
              setBarcode={setBarcode}
              labelColor={labelColor}
              setLabelColor={setLabelColor}
              backgroundColor={backgroundColor}
              setBackgroundColor={setBackgroundColor}
              headerFieldValue={headerFieldValue}
              setHeaderFieldValue={setHeaderFieldValue}
              headerFieldLabel={headerFieldLabel}
              setHeaderFieldLabel={setHeaderFieldLabel}
              textColor={textColor}
              setTextColor={setTextColor}
            />
          </Grid>
          <Grid md={4} xs={12} item>
            <div className="sticky top-120">
              <Box
                sx={{
                  width: "100%",
                  m: "auto",
                  "@media (max-width: 900px)": { width: "50%" },
                  "@media (max-width: 500px)": { width: "80%" },
                }}>
                <Card
                  title="holidays"
                  withControl={false}
                  tempPhoto={tempPhoto}
                  activeImg={activeImg}
                  setActiveImg={setActiveImg}
                  textLogo={textLogo}
                  setTextLogo={setTextLogo}
                  logoImg={logoImg}
                  setLogoImg={setLogoImg}
                  stickersNumber={stickersNumber}
                  setStickersNumber={setStickersNumber}
                  activeIcon={activeIcon}
                  setActiveIcon={setActiveIcon}
                  name={name}
                  setName={setName}
                  activeScanType={activeScanType}
                  setActiveScanType={setActiveScanType}
                  imgColor={imgColor}
                  setImgColor={setImgColor}
                  barcode={barcode}
                  setBarcode={setBarcode}
                  labelColor={labelColor}
                  setLabelColor={setLabelColor}
                  textColor={textColor}
                  setTextColor={setTextColor}
                  backgroundColor={backgroundColor}
                  setBackgroundColor={setBackgroundColor}
                  headerFieldValue={headerFieldValue}
                  setHeaderFieldValue={setHeaderFieldValue}
                  headerFieldLabel={headerFieldLabel}
                  setHeaderFieldLabel={setHeaderFieldLabel}
                />
              </Box>
            </div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default CreateCard;
