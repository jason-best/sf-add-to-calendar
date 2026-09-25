const PRODID = "-//Three Levers//AddToCalendar//EN";
const DEFAULT_TITLE = "Event";
const DEFAULT_DURATION_MS = 60 * 60 * 1000;
const ICS_FILE_NAME = "event.ics";

const EMPTY = {
  googleUrl: "",
  outlookUrl: "",
  outlookLiveUrl: "",
  yahooUrl: "",
  icsContent: "",
  icsFileName: "",
  error: ""
};

/**
 * Builds Google, Outlook, Yahoo, and iCalendar values for one event.
 * Timed events are UTC instants. All-day events use a calendar date in the
 * named time zone (UTC when the time zone is blank). A blank end is one hour
 * after start, or that day only when the event is all-day. An all-day end is
 * the last day; the calendar file and links use the next day as the exclusive end.
 */
export function buildCalendarLinks(input, options = {}) {
  const source = input || {};
  const startRaw = source.start;
  if (isBlank(startRaw)) {
    return { ...EMPTY, error: "A start date is required." };
  }

  const start = parseInstant(startRaw);
  if (!start) {
    return { ...EMPTY, error: "Start is not a valid date." };
  }

  let end = null;
  if (!isBlank(source.end)) {
    end = parseInstant(source.end);
    if (!end) {
      return { ...EMPTY, error: "End is not a valid date." };
    }
  }

  let timeZone = null;
  if (!isBlank(source.timeZone)) {
    timeZone = resolveTimeZone(source.timeZone);
    if (!timeZone) {
      return {
        ...EMPTY,
        error:
          'Time zone "' +
          String(source.timeZone).trim() +
          '" is not recognized. Use a time zone ID such as America/Los_Angeles, or leave it blank.'
      };
    }
  }

  const allDay = source.allDay === true || source.allDay === "true";
  const title = isBlank(source.title)
    ? DEFAULT_TITLE
    : String(source.title).trim();
  const description = isBlank(source.description)
    ? ""
    : String(source.description);
  const location = isBlank(source.location)
    ? ""
    : String(source.location).trim();
  const url = isBlank(source.url) ? "" : String(source.url).trim();
  const uid = isBlank(source.uid) ? "" : String(source.uid).trim();
  const now = options.now instanceof Date ? options.now : new Date();

  let range;
  try {
    range = eventRange(start, end, allDay, timeZone);
  } catch (e) {
    return { ...EMPTY, error: e.message };
  }

  const body = detailsText(description, url);
  return {
    googleUrl: googleUrl(title, range, body, location, timeZone),
    outlookUrl: outlookUrl(
      "https://outlook.office.com/calendar/0/deeplink/compose",
      title,
      range,
      body,
      location
    ),
    outlookLiveUrl: outlookUrl(
      "https://outlook.live.com/calendar/0/deeplink/compose",
      title,
      range,
      body,
      location
    ),
    yahooUrl: yahooUrl(title, range, body, location),
    icsContent: buildIcs({
      title,
      description,
      location,
      url,
      uid,
      range,
      now
    }),
    icsFileName: ICS_FILE_NAME,
    error: ""
  };
}

export function createEventUid() {
  const id =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : Date.now().toString(16) + Math.random().toString(16).slice(2);
  return id + "@threelevers.com";
}

function eventRange(start, end, allDay, timeZone) {
  if (allDay) {
    const startDate = calendarDate(start, timeZone);
    const lastDate = end ? calendarDate(end, timeZone) : startDate;
    const exclusiveEnd = addCalendarDays(lastDate, 1);
    if (exclusiveEnd <= startDate) {
      throw new Error("End must be after start.");
    }
    return {
      allDay: true,
      startDate,
      endDate: exclusiveEnd
    };
  }

  const endInstant = end || new Date(start.getTime() + DEFAULT_DURATION_MS);
  if (endInstant.getTime() <= start.getTime()) {
    throw new Error("End must be after start.");
  }
  return {
    allDay: false,
    start,
    end: endInstant
  };
}

function googleUrl(title, range, body, location, timeZone) {
  const params = new URLSearchParams();
  params.set("action", "TEMPLATE");
  params.set("text", title);
  params.set(
    "dates",
    range.allDay
      ? range.startDate + "/" + range.endDate
      : compactUtc(range.start) + "/" + compactUtc(range.end)
  );
  if (body) {
    params.set("details", body);
  }
  if (location) {
    params.set("location", location);
  }
  if (timeZone) {
    params.set("ctz", timeZone);
  }
  return "https://calendar.google.com/calendar/render?" + params.toString();
}

function outlookUrl(base, title, range, body, location) {
  const params = new URLSearchParams();
  params.set("path", "/calendar/action/compose");
  params.set("rru", "addevent");
  params.set("subject", title);
  params.set(
    "startdt",
    range.allDay ? dashedDate(range.startDate) : isoUtc(range.start)
  );
  params.set(
    "enddt",
    range.allDay ? dashedDate(range.endDate) : isoUtc(range.end)
  );
  params.set("allday", range.allDay ? "true" : "false");
  if (body) {
    params.set("body", body);
  }
  if (location) {
    params.set("location", location);
  }
  return base + "?" + params.toString();
}

function yahooUrl(title, range, body, location) {
  const params = new URLSearchParams();
  params.set("v", "60");
  params.set("view", "d");
  params.set("type", "20");
  params.set("title", title);
  if (range.allDay) {
    params.set("st", range.startDate);
    params.set("et", range.endDate);
    params.set("dur", "allday");
  } else {
    params.set("st", compactUtc(range.start));
    params.set("et", compactUtc(range.end));
  }
  if (body) {
    params.set("desc", body);
  }
  if (location) {
    params.set("in_loc", location);
  }
  return "https://calendar.yahoo.com/?" + params.toString();
}

function buildIcs({ title, description, location, url, uid, range, now }) {
  const lines = [
    "BEGIN:VCALENDAR",
    "PRODID:" + PRODID,
    "VERSION:2.0",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "UID:" + escapeText(uid),
    "DTSTAMP:" + compactUtc(now),
    range.allDay
      ? "DTSTART;VALUE=DATE:" + range.startDate
      : "DTSTART:" + compactUtc(range.start),
    range.allDay
      ? "DTEND;VALUE=DATE:" + range.endDate
      : "DTEND:" + compactUtc(range.end),
    "SUMMARY:" + escapeText(title)
  ];
  if (description) {
    lines.push("DESCRIPTION:" + escapeText(description));
  }
  if (location) {
    lines.push("LOCATION:" + escapeText(location));
  }
  if (url) {
    lines.push("URL:" + escapeText(url));
  }
  lines.push("END:VEVENT", "END:VCALENDAR");
  return foldLines(lines);
}

function detailsText(description, url) {
  const parts = [];
  if (description) {
    parts.push(description);
  }
  if (url) {
    parts.push(url);
  }
  return parts.join("\n\n");
}

function calendarDate(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timeZone || "UTC",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);
  const map = {};
  for (const part of parts) {
    map[part.type] = part.value;
  }
  return map.year + map.month + map.day;
}

function addCalendarDays(yyyymmdd, days) {
  const year = Number(yyyymmdd.slice(0, 4));
  const month = Number(yyyymmdd.slice(4, 6));
  const day = Number(yyyymmdd.slice(6, 8));
  const next = new Date(Date.UTC(year, month - 1, day + days));
  const monthText = String(next.getUTCMonth() + 1).padStart(2, "0");
  const dayText = String(next.getUTCDate()).padStart(2, "0");
  return String(next.getUTCFullYear()) + monthText + dayText;
}

function dashedDate(yyyymmdd) {
  return (
    yyyymmdd.slice(0, 4) +
    "-" +
    yyyymmdd.slice(4, 6) +
    "-" +
    yyyymmdd.slice(6, 8)
  );
}

function compactUtc(date) {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
}

function isoUtc(date) {
  return date.toISOString().replace(/\.\d{3}Z$/, "Z");
}

function resolveTimeZone(value) {
  const trimmed = String(value).trim();
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: trimmed
    }).resolvedOptions().timeZone;
  } catch {
    return null;
  }
}

function parseInstant(value) {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isBlank(value) {
  return value == null || String(value).trim() === "";
}

function escapeText(value) {
  if (value == null) {
    return "";
  }
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function foldLines(lines) {
  let ics = "";
  for (const line of lines) {
    ics += foldLine(line);
  }
  return ics;
}

function foldLine(line) {
  if (line.length <= 75) {
    return line + "\r\n";
  }
  let folded = line.substring(0, 75) + "\r\n";
  let index = 75;
  while (index < line.length) {
    const endIndex = Math.min(index + 74, line.length);
    folded += " " + line.substring(index, endIndex) + "\r\n";
    index = endIndex;
  }
  return folded;
}
