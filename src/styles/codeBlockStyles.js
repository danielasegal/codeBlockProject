export const taskBlockStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginTop: "7vh",
  borderRadius: "5px",
  backgroundColor: "yellow",
  cursor: "pointer",
  color: "black",
  width: window.innerWidth < 768 ? "30vw" : "15vw",
  height: "15vh",
  margin: window.innerWidth < 768 ? "3vw" : "4vh",
};

export const logBlockStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "yellow",
  marginTop: "7vh",
  borderRadius: "5px",
  cursor: "pointer",
  color: "black",
  width: "30vw",
  height: "15vh",
  margin: "4vh",
};

export const taskPageTitleStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};

export const taskPageDescriptionStyle = {
  width: "80%",
  fontSize: "12px",
  marginBottom: "20px",
};

export const submitBtnStyle = {
  margin: "15px",
  fontSize: "12px",
  background: "yellow",
  color: "black",
  marginTop: "25px",
};

export const smileImgStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  zIndex: 9999,
  width: "150px",
  height: "150px",
};
