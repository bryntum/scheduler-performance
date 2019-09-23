import { RenderTimer, FPS, Scroller } from '../util/util.js';

async function init() {
    const resourceResponse = await fetch('../util/2500-resources.json');
    const resources = await resourceResponse.json();
    const eventResponse = await fetch('../util/50000-events.json');
    const events = await eventResponse.json();

    ej.base.enableRipple(true);

    resources.forEach(r => {
        r.text = r.firstName + ' ' + r.surname;
    });

    await RenderTimer.start({
        sync : false,
        callback() {
            let count = 0;
            const scheduler = new ej.schedule.Schedule({
                width          : '1024px',
                height         : '768px',
                selectedDate   : new Date(2019, 8, 20),
                currentView    : 'TimelineWeek',
                views          : [
                    { option : 'TimelineWeek', allowVirtualScrolling : true, interval : 2 }
                ],
                rowAutoHeight  : true,
                showHeaderBar  : false,
                showQuickInfo  : false,
                // To start on same day as others
                firstDayOfWeek : 5,
                eventSettings  : {
                    dataSource : events,
                    fields     : {
                        id        : 'id',
                        subject   : { title : 'Name', name : 'name' },
                        startTime : { title : 'Start', name : 'startDate' },
                        endTime   : { title : 'End', name : 'endDate' }
                    }
                },
                resources      : [ {
                    field         : 'resourceId',
                    title         : 'Name',
                    name          : 'Resources',
                    allowMultiple : false,
                    dataSource    : resources,
                    textField     : 'text',
                    idField       : 'id'
                } ],
                group          : {
                    enableCompactView : false,
                    resources         : [ 'Resources' ]
                }
            });
            scheduler.appendTo('#container');
            const fn = () => {
                if (count++ === 300) {
                    // Found no way of knowing when rendering is complete...
                    RenderTimer.stop();
                    scheduler.removeEventListener('eventRendered', fn);
                }
            };
            scheduler.addEventListener('eventRendered', fn);
        }
    });

    setTimeout(() => {
        FPS.start();
        Scroller.scroll({
            element : document.querySelector('.e-content-wrap'),
            callback() {
                FPS.stop();
            }
        });
    }, 500);
}

init();
