import { RenderTimer, FPS, Scroller, count } from '../util/util.js';

async function init() {
    const resourceResponse = await fetch('../util/2500-resources.json');
    let resources = await resourceResponse.json();
    const eventResponse = await fetch('../util/50000-events.json');
    let events = await eventResponse.json();

    resources = resources.filter(r => r.id < count);
    events = events.filter(r => r.resourceId < count);

    resources.forEach(r => {
        r.value = r.id;
        r.text = r.firstName + ' ' + r.surname;
    });

    events.forEach(e => {
        e.start = e.startDate;
        e.end = e.endDate;
        e.title = e.name;
        delete e.duration;
    });

    await RenderTimer.start({
        callback() {
            $("#container").kendoScheduler({
                date           : new Date(2019, 8, 22),
                startTime      : new Date(2019, 8, 22),
                eventHeight    : 20,
                majorTick      : 60,
                minorTickCount : 1,
                views          : [
                    {
                        type                    : "timelineWeek",
                        columnWidth             : 20,
                        majorTimeHeaderTemplate : kendo.template("#=kendo.toString(date, 'H')#")
                    }
                ],
                timezone       : "Etc/UTC",
                dataSource     : events,
                group          : {
                    resources   : [ "People" ],
                    orientation : "vertical"
                },
                resources      : [
                    {
                        field      : "resourceId",
                        name       : "People",
                        dataSource : resources,
                        title      : "Name"
                    }
                ]
            });
        }
    });

    setTimeout(() => {
        FPS.start();
        Scroller.scroll({
            element : document.querySelector('.k-scheduler-content'),
            distance : Math.min(count * 50, 75000),
            callback() {
                FPS.stop();
            }
        });
    }, 500);
}

init();
