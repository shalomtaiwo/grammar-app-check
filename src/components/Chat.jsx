import classnames from "classnames";
import { Alert, AlertTitle } from "@mui/material";

const Chat = ({ isBot, text }) => {
	return (
		<div className={classnames("msg", { bot: isBot, user: !isBot })}>
		
			{isBot ? (
				<Alert severity="success">
					<AlertTitle>RIRI BOT</AlertTitle>
					{text}
				</Alert>
			) : (
				<Alert severity="info">
					<AlertTitle>Shalom</AlertTitle>
					{text}
				</Alert>
			)}
		</div>
	);
};

export default Chat;
