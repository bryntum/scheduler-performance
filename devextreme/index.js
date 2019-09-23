import { RenderTimer, FPS, Scroller } from '../util/util.js';

$(async function () {
    const resourceResponse = await fetch('../util/2500-resources.json');
    let resources = await resourceResponse.json();
    const eventResponse = await fetch('../util/50000-events.json');
    let events = await eventResponse.json();

    resources = resources.filter(r => r.id < 500);
    events = events.filter(r => r.resourceId < 500);

    // Map to format used by devextreme
    events.forEach(e => {
        e.text = e.name;
    });

    // Map to format used by devextreme
    resources.forEach(r => {
        r.text = r.firstName + ' ' + r.surname;
    });

    await RenderTimer.start({
        callback() {
            $("#container").dxScheduler({
                dataSource               : events,
                views                    : [ "timelineWeek" ],
                currentView              : "timelineWeek",
                currentDate              : new Date(2019, 8, 20),
                firstDayOfWeek           : 5,
                startDayHour             : 0,
                endDayHour               : 24,
                cellDuration             : 60,
                groups                   : [ "resourceId" ],
                maxAppointmentsPerCell   : 2,
                crossScrollingEnabled    : true,
                showCurrentTimeIndicator : false,
                resources                : [ {
                    fieldExpr     : "resourceId",
                    allowMultiple : false,
                    dataSource    : resources,
                    label         : "Name"
                } ],
                timeCellTemplate         : itemData => itemData.date.getHours()
            });
        }
    });

    setTimeout(() => {
        FPS.start();
        Scroller.scroll({
            element : document.querySelector('.dx-scheduler-date-table-scrollable .dx-scrollable-container'),
            distance : 30000, // Cannot render larger dataset, so cannot scroll further
            callback() {
                FPS.stop();
            }
        });
    }, 500);
});
