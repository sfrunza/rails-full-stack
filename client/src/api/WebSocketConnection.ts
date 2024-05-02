import ActionCable from 'actioncable';

const cable = ActionCable.createConsumer(import.meta.env.VITE_WS_URL!);

export default cable;