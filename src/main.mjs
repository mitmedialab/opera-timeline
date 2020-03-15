import { MasterTimeline, Timeline, d3, createTimelineEvents } from 'd3-media-timeline';

// This is how we add 
import opera from './content/opera.yaml';
const operaContent = createTimelineEvents(opera);

// Setup the MasterTimeline
const parentSelection = d3.select('div#media-timeline');
window.master = new MasterTimeline(parentSelection);

// Add sub timelines
master.addTimeline('Opera of the Future', operaContent, { start: new Date(1985, 0, 1), end: new Date() });

// Update the master, to ensure that the initial render
master.update();

// These are just for testing
window.MasterTimeline = MasterTimeline;
window.Timeline = Timeline;
window.operaContent = operaContent;
