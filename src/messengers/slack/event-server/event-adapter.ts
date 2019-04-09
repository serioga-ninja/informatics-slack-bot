import {createEventAdapter} from '@slack/events-api';
import variables from '../../../configs/variables';

const slackEvents = createEventAdapter(variables.slack.CLIENT_SECRET);
// Attach listeners to events by Slack Event "type". See: https://api.slack.com/events/message.im
slackEvents.on('message', (event) => {
  console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);
});

export default slackEvents;
