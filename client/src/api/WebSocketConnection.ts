import ActionCable from 'actioncable';

const cable = ActionCable.createConsumer(process.env.REACT_APP_WS_URL || 'ws://localhost:3001/cable');

export default cable;