import { RenderTimer, FPS, Scroller } from '../util/util.js';

async function init() {
    const resourceResponse = await fetch('../util/2500-resources.json');
    const resources = await resourceResponse.json();
    const eventResponse = await fetch('../util/50000-events.json');
    const events = await eventResponse.json();

    // Map to format used by dhtmlx
    resources.forEach(r => {
        r.key = r.id;
        r.label = r.firstName + ' ' + r.surname;
    });

    events.forEach(e => {
        Object.assign(e, {
            text       : e.name,
            start_date : e.startDate,
            end_date   : e.endDate
        });
    });

    RenderTimer.start({
        callback() {
            var days = 9;
            scheduler.createTimelineView({
                name            : 'timeline',
                x_unit          : 'hour',
                x_date          : '%H',
                x_step          : 1,
                x_size          : 24 * days,
                x_start         : 8,
                scrollable      : true,
                scroll_position : new Date(2019, 8, 20),
                column_width    : 20,
                x_length        : 24 * days,
                y_unit          : resources,
                y_property      : 'resourceId',
                render          : 'bar',
                second_scale    : {
                    x_unit : 'day', // unit which should be used for second scale
                    x_date : '%F %d' // date format which should be used for second scale, 'July 01'
                },
                dx              : 130
            });

            scheduler.init('container', new Date(2019, 8, 20), 'timeline');
            scheduler.parse(events);

            setTimeout(() => {
                FPS.start();
                Scroller.scroll({
                    element : document.querySelector('.dhx_timeline_scrollable_data'),
                    callback() {
                        FPS.stop();
                    }
                });
            }, 500);
        }
    });
}

init();
