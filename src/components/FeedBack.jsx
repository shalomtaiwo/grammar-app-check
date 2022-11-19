import { Alert, AlertTitle } from "@mui/material";

const FeedBack = ({ text }) => {
  return (
    <div className="feedback">
      <Alert severity="error">
					<AlertTitle>SPEECH CORRECTION</AlertTitle>
					That was not quite correct, you should say: {text}
				</Alert>
    </div>
  );
};
export default FeedBack;