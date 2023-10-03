const fs = require("fs/promises");
const yaml = require("yaml");
const { parse } = require("node-html-parser");

const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

const TIMEZONE = "Europe/Amsterdam";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat)
dayjs.tz.setDefault(TIMEZONE);

async function getEvents(url, out = "./bms-lab-events.yml") {
    const response = await fetch(url);
    const body = await response.text();
    const root = parse(body);
    let events = root.querySelectorAll("li.summary__introblock").map(async (li) => {
        const event_url = li.querySelector("a.summary__link").attributes["href"];
        const img_url = new URL(
            li.querySelector("img.summary__image").attributes["src"],
            "https://utwente.nl/"
        );
        const title = li.querySelector(".summary__title").innerText.trim();
        const description = li
            .querySelector(".summary__description")
            .innerText.trim();
        const date = li.querySelector(".summary__date").innerText.trim();
        const [startDate, endDate] = await getEventTimes(event_url);

        return {
            title,
            description,
            url: event_url,
            img_url: img_url.href,
            date,
            start: startDate,
            end: endDate
        };
    });
    let evaluated_events = await Promise.all(events);

    // convert date/time to be equivalent to events
    for (const event of evaluated_events) {
        event.date = event.start.format("YYYY-MM-DD");
        event.endDate = event.end.format("YYYY-MM-DD");

        if (event.end.isBefore(event.start.add(1, "day"))) {
            event.time = event.start.format("HH:mm") + " - " + event.end.format("HH:mm");
        }

        event.start = event.start.format()
        event.end = event.end.format()
    }

    // write to outfile
    await fs.writeFile(out, yaml.stringify(evaluated_events));
}

async function getEventTimes(url) {
    const response = await fetch(url);
    const body = await response.text();
    const root = parse(body);

    const start = root.querySelector("div.addeventatc span.start").innerText.trim();
    const end = root.querySelector("div.addeventatc span.end").innerText.trim();

    return [dayjs(start, "DD/MM/YYYY HH:mm"), dayjs(end, "DD/MM/YYYY HH:mm")];
}

function main() {
    const [,,url, out] = process.argv;

    if (!url) {
        console.log("an input url is required. \n\nUsage:\n\tnode bms-lab-events.js <url> [<output>]\n\nurl: \t\turl to events list.\noutput: \tpath to output file (defaults to: \"./bms-lab-events.yaml\")");
        process.exit(1)
    }
    getEvents(url, out);
}

main();
