import { RenderTimer, FPS, Scroller, count } from '../util/util.js';

async function init() {
    const resourceResponse = await fetch('../util/2500-resources.json');
    let resources = await resourceResponse.json();
    const eventResponse = await fetch('../util/50000-events.json');
    let events = await eventResponse.json();

    resources = resources.filter(r => r.id < count);
    events = events.filter(r => r.resourceId < count);

    resources.forEach(r => {
        r.text = r.firstName + ' ' + r.surname;
    });

    await RenderTimer.start({
        sync : false,
        callback() {
            let count = 0;
            const scheduler = new ej.schedule.Schedule({
                width         : '1024px',
                height        : '768px',
                selectedDate  : new Date(2019, 8, 22),
                currentView   : 'TimelineWeek',
                views         : [
                    { option : 'TimelineWeek', allowVirtualScrolling : true }
                ],
                rowAutoHeight : true,
                showHeaderBar : false,
                showQuickInfo : false,
                eventSettings : {
                    dataSource : events,
                    fields     : {
                        id        : 'id',
                        subject   : { title : 'Name', name : 'name' },
                        startTime : { title : 'Start', name : 'startDate' },
                        endTime   : { title : 'End', name : 'endDate' }
                    }
                },
                resources     : [ {
                    field         : 'resourceId',
                    title         : 'Name',
                    name          : 'Resources',
                    allowMultiple : false,
                    dataSource    : resources,
                    textField     : 'text',
                    idField       : 'id'
                } ],
                group         : {
                    enableCompactView : false,
                    resources         : [ 'Resources' ]
                },
                timeScale     : {
                    enable    : true,
                    interval  : 60,
                    slotCount : 1
                },
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
            distance : Math.min(count * 50, 75000),
            callback() {
                FPS.stop();
            }
        });
    }, 500);
}

init();
