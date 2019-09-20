import { Scheduler } from './js/scheduler.module.js';
import { RenderTimer, FPS, Scroller } from '../util/util.js';

async function init() {
    const resourceResponse = await fetch('../util/2500-resources.json');
    const resources = await resourceResponse.json();
    const eventResponse = await fetch('../util/50000-events.json');
    const events = await eventResponse.json();
    //const events = EventGenerator.generate();

    // Map to format used by bryntum
    resources.forEach(r => {
        r.name = r.firstName + ' ' + r.surname;
    });


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
                    { field : 'name', text : 'Name', width : 130 }
                ],

                resourceStore : {
                    useRawData : true,
                    data       : resources
                },

                eventStore : {
                    useRawData : false,
                    data       : events
                },

                viewPreset          : {
                    name         : 'hourAndDay',
                    tickWidth    : 40,
                    headerConfig : {
                        middle : {
                            unit       : 'hour',
                            dateFormat : 'HH'
                        },
                        top    : {
                            unit       : 'day',
                            dateFormat : 'MMMM D'
                        }
                    }
                },
                startDate           : new Date(2019, 8, 20, 8),
                endDate             : new Date(2019, 8, 29),
                useInitialAnimation : false,

                rowHeight : 23,
                barMargin : 1
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
