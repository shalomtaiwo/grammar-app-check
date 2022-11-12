import classnames from "classnames";
import {Alert} from "antd";

const Chat = ({ isBot, text }) => {
  return (
    <div className={classnames("msg", { bot: isBot, user: !isBot })}>
			¨
			{isBot ? (
				<Alert
					message="RIRI BOT"
					description={text}
					type="success"
				/>
			) : (
				<Alert
					message="Shalom Taiwo"
					description={text}
					type="info"
          className={"user"}
				/>
			)}
		</div>
  );
};

export default Chat;
