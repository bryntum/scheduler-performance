import { RenderTimer, FPS, Scroller } from '../util/util.js';

$(async function () {
    const resourceResponse = await fetch('../util/2500-resources.json');
    const resources = await resourceResponse.json();
    const eventResponse = await fetch('../util/50000-events.json');
    const events = await eventResponse.json();

    // Map to format used by bryntum
    events.forEach(e => {
        e.text = e.name;
    });

    // Map to format used by bryntum
    resources.forEach(r => {
        r.text = r.firstName + ' ' + r.surname;
    });

    RenderTimer.start({
        callback() {
            $("#container").dxScheduler({
                dataSource               : events.filter(e => e.resourceId < 250),
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
                    dataSource    : resources.filter(r => r.id < 250),
                    label         : "Name"
                } ],
                timeCellTemplate         : itemData => itemData.date.getHours()
            });

            setTimeout(() => {
                FPS.start();
                Scroller.scroll({
                    distance : 20000, // Cannot render larger dataset, so cannot scroll further
                    element : document.querySelector('.dx-scheduler-date-table-scrollable .dx-scrollable-container'),
                    callback() {
                        FPS.stop();
                    }
                });
            }, 500);
        }
    });
});
