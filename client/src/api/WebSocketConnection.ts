import ActionCable from 'actioncable';

const cable = ActionCable.createConsumer('ws://localhost:3001/cable');

export default cable;