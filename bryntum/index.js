import { Scheduler } from './js/scheduler.module.js';
import { RenderTimer, FPS, Scroller } from '../util/util.js';

async function init() {
    const resourceResponse = await fetch('../util/2500-resources.json');
    const resources = await resourceResponse.json();
    const eventResponse = await fetch('../util/50000-events.json');
    const events = await eventResponse.json();
    //const events = EventGenerator.generate();

    RenderTimer.start({
        callback() {
            const scheduler = window.scheduler = new Scheduler({
                appendTo : 'container',

                // Bryntum Grid has many features enabled by default, turn them off to match others
                features : {
                    cellEdit        : false,
                    columnPicker    : false,
                    columnReorder   : false,
                    columnResize    : false,
                    contextMenu     : false,
                    group           : false,
                    sort            : false,
                    eventDrag       : false,
                    eventResize     : false,
                    eventDragCreate : false,
                    eventTooltip    : false,
                    eventEdit       : false,
                    scheduleTooltip : false
                },

                columns : [
                    { field : 'id', text : 'Id', width : 100 },
                    { field : 'firstName', text : 'First name', width : 130 },
                    { field : 'surname', text : 'Surname', width : 130 }
                ],

                resourceStore : {
                    useRawData : true,
                    data       : resources
                },

                eventStore : {
                    useRawData : false,
                    data       : events
                },

                viewPreset          : 'hourAndDay',
                startDate           : new Date(2019, 8, 20, 8),
                endDate             : new Date(2019, 8, 29),
                useInitialAnimation : false
            });

            setTimeout(() => {
                FPS.start();
                Scroller.scroll({
                    element : scheduler.bodyContainer,
                    callback() {
                        FPS.stop();
                    }
                });
            }, 500);
        }
    });
}

init();
