import { Alert } from 'antd';

const FeedBack = ({ text }) => {
  return (
    <div className="feedback">
      <Alert className='feedback' type="error" message={`That was not quite correct, you should say: ${text}`} />
    </div>
  );
};
export default FeedBack;