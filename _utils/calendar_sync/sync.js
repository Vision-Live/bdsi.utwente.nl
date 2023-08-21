const ICAL = require("ical.js");
const fs = require("fs/promises");
const yaml = require("yaml");
const dayjs = require("dayjs");

async function getCalendarData(url, out) {
    const response = await fetch(url);
    const icalData = await response.text();
    const jcalData = ICAL.parse(icalData);
    const comp = new ICAL.Component(jcalData);
    const events = [];

    for (const vevent of comp.getAllSubcomponents('vevent')) {

        const event = new ICAL.Event(vevent);

        if (event.isRecurring) {
            const iterator = event.iterator();
            let next = iterator.next();
            while (next) {
                if (next.toJSDate() >= Date.now()) {
                    const occurrence = event.getOccurrenceDetails(next);
                    events.push({ title: (occurrence.summary ?? event.summary).replace(/^Copy: /, ""), location: occurrence.location ?? event.location, start: occurrence.startDate.toJSDate(), end: occurrence.endDate.toJSDate() });
                }
                next = iterator.next();
            }
        } else {
            events.push({ title: event.summary.replace(/^Copy: /, ""), location: event.location, start: event.startDate.toJSDate(), end: event.endDate.toJSDate() });
        }
    }

    // convert date/time to be equivalent to events
    for (const event of events) {
        const start = dayjs(event.start);
        const end = dayjs(event.end);

        event.startDate = start.format("YYYY-MM-DD");

        if (end.isBefore(start.add(1, "day"))) {
            event.time = start.format("HH:mm") + " - " + end.format("HH:mm");
        }
    }


    await fs.writeFile(out, yaml.stringify(events));
}

function main() {
    let [,, feed, target] = process.argv;
    target ??= "./calendar.yaml";

    if (!feed) {
        console.log("an input feed is required. \n\nUsage:\n\tnode sync.js <feed> [<output>]\n\nfeed: \t\turl to .ics (iCal) feed.\noutput: \tpath to output file (defaults to: \"./calendar.yaml\")");
        process.exit(1)
    }

    getCalendarData(feed, target);
}

main();