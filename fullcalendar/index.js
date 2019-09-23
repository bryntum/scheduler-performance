import { RenderTimer, FPS, Scroller } from '../util/util.js';

async function init() {
    const resourceResponse = await fetch('../util/2500-resources.json');
    let resources = await resourceResponse.json();
    const eventResponse = await fetch('../util/50000-events.json');
    let events = await eventResponse.json();

    resources = resources.filter(r => r.id < 500);
    events = events.filter(r => r.resourceId < 500);

    resources.forEach(r => {
        r.title = r.firstName + ' ' + r.surname;
    });

    events.forEach(e => {
        e.start = e.startDate;
        e.end = e.endDate;
        e.title = e.name;
    });

    await RenderTimer.start({
        callback() {
            const calendar = new FullCalendar.Calendar(document.getElementById('container'), {
                plugins           : [ 'resourceTimeline' ],
                header            : false,
                now               : '2019-09-20',
                editable          : false,
                scrollTime        : '08:00',
                defaultView       : 'resourceTimelineSevenDays',
                views             : {
                    resourceTimelineSevenDays : {
                        type       : 'resourceTimeline',
                        duration   : { days : 7 }
                    }
                },
                resourceLabelText : 'Name',
                resourceAreaWidth : 130,
                slotWidth         : 20,
                slotLabelFormat   : [
                    { month : 'long', day : 'numeric' }, // top level of text
                    { hour : 'numeric', hour12 : false } // lower level of text
                ],
                resources,
                events
            });

            calendar.render();
        }
    });

    setTimeout(() => {
        FPS.start();
        Scroller.scroll({
            element : document.querySelector('.fc-body .fc-time-area .fc-scroller'),
            distance : 30000,
            callback() {
                FPS.stop();
            }
        });
    }, 500);

}

init();
