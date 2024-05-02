import ActionCable from 'actioncable';

const cable = ActionCable.createConsumer(process.env.REACT_APP_WS_URL!);

export default cable;