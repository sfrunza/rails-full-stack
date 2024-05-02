import ActionCable from 'actioncable';

const cable = ActionCable.createConsumer(process.env.VITE_WS_URL!);

export default cable;