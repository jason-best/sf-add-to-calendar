import { LightningElement, api } from "lwc";
import { buildCalendarLinks, createEventUid } from "./calendarLinks";

const DEBUG_PREFIX = "[addToCalendar]";

export default class AddToCalendar extends LightningElement {
  @api eventTitle;
  @api eventDescription;
  @api eventLocation;
  @api eventUrl;
  @api startDateTime;
  @api endDateTime;
  @api allDay;
  @api timeZone;
  @api eventUid;
  @api buttonLabel;

  @api showGoogle;
  @api showOutlook;
  @api showOutlookLive;
  @api showYahoo;
  @api showApple;
  @api showIcs;

  /** When true, logs the inputs and the built calendar result in the browser console. Errors are always logged. */
  @api debug;

  @api googleCalendarUrl = "";
  @api outlookCalendarUrl = "";
  @api outlookLiveCalendarUrl = "";
  @api yahooCalendarUrl = "";
  @api icsContent = "";
  @api icsFileName = "";
  @api error = "";

  _generatedUid;
  _builtAt;
  _lastLogKey = "";
  downloadMessage = "";

  connectedCallback() {
    if (!this._builtAt) {
      this._builtAt = new Date();
    }
    if (!this._generatedUid) {
      this._generatedUid = createEventUid();
    }
  }

  @api
  validate() {
    const built = this.built;
    if (built.error) {
      return { isValid: false, errorMessage: built.error };
    }
    return { isValid: true };
  }

  get built() {
    try {
      return buildCalendarLinks(
        {
          title: asText(this.eventTitle),
          description: asText(this.eventDescription),
          location: asText(this.eventLocation),
          url: asText(this.eventUrl),
          start: this.startDateTime,
          end: this.endDateTime,
          allDay: this.allDay === true || this.allDay === "true",
          timeZone: asText(this.timeZone),
          uid: this.resolvedUid()
        },
        { now: this._builtAt || new Date() }
      );
    } catch (buildError) {
      const message = buildError && buildError.message ? buildError.message : "The calendar link could not be built.";
      console.error(DEBUG_PREFIX, message, buildError, { inputs: this.inputSnapshot() });
      return {
        googleUrl: "",
        outlookUrl: "",
        outlookLiveUrl: "",
        yahooUrl: "",
        icsContent: "",
        icsFileName: "",
        error: message
      };
    }
  }

  get menuItems() {
    const items = [];
    if (this.showGoogle !== false) {
      items.push({ value: "google", label: "Google Calendar" });
    }
    if (this.showOutlook !== false) {
      items.push({ value: "outlook", label: "Outlook" });
    }
    if (this.showOutlookLive !== false) {
      items.push({ value: "outlookLive", label: "Outlook.com" });
    }
    if (this.showYahoo !== false) {
      items.push({ value: "yahoo", label: "Yahoo Calendar" });
    }
    if (this.showApple !== false) {
      items.push({ value: "apple", label: "Apple Calendar" });
    }
    if (this.showIcs !== false) {
      items.push({ value: "ics", label: "Download calendar file" });
    }
    return items;
  }

  get resolvedButtonLabel() {
    return isBlank(this.buttonLabel) ? "Add to Calendar" : this.buttonLabel;
  }

  get isDisabled() {
    return Boolean(this.built.error) || this.menuItems.length === 0;
  }

  get statusMessage() {
    if (this.built.error) {
      return this.built.error;
    }
    if (this.downloadMessage) {
      return this.downloadMessage;
    }
    if (this.menuItems.length === 0) {
      return "Turn on at least one calendar option.";
    }
    return "";
  }

  renderedCallback() {
    try {
      this.publishOutputs();
      this.logState();
    } catch (renderError) {
      console.error(DEBUG_PREFIX, "screen update failed", renderError, {
        inputs: this.inputSnapshot()
      });
    }
  }

  handleSelect(event) {
    const built = this.built;
    const choice = event.detail.value;
    this.debugLog("menu selected", { choice, error: built.error });
    if (built.error) {
      return;
    }
    if (choice === "ics" || choice === "apple") {
      try {
        this.downloadIcs(built.icsContent, built.icsFileName);
        this.downloadMessage = "";
        this.debugLog("calendar file download started", {
          choice,
          fileName: built.icsFileName,
          length: built.icsContent ? built.icsContent.length : 0
        });
      } catch (downloadError) {
        const message = errorText(downloadError) || "The calendar file could not be downloaded.";
        this.downloadMessage = message;
        console.error(DEBUG_PREFIX, "calendar file download failed:", message, downloadError);
      }
      return;
    }
    const urls = {
      google: built.googleUrl,
      outlook: built.outlookUrl,
      outlookLive: built.outlookLiveUrl,
      yahoo: built.yahooUrl
    };
    const url = urls[choice];
    if (!url) {
      console.error(DEBUG_PREFIX, "no URL for menu choice", {
        choice,
        inputs: this.inputSnapshot()
      });
      return;
    }
    this.debugLog("opening calendar", { choice, url });
    window.open(url, "_blank", "noopener,noreferrer");
  }

  downloadIcs(content, fileName) {
    const anchor = this.template.querySelector('[data-id="ics-download"]');
    if (!anchor) {
      throw new Error("The download link is not on the page.");
    }
    const name = fileName || "event.ics";
    // Lightning blocks inserting a new link into the template. Use the link
    // that is already rendered, and keep the file URL alive past the click.
    // Locker rejects text/calendar. The .ics name is what Calendar opens.
    const blob = new Blob([content || ""], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    anchor.setAttribute("href", url);
    anchor.setAttribute("download", name);
    anchor.click();
    window.setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 2000);
  }

  publishOutputs() {
    const built = this.built;
    this.assignOutput("googleCalendarUrl", built.googleUrl);
    this.assignOutput("outlookCalendarUrl", built.outlookUrl);
    this.assignOutput("outlookLiveCalendarUrl", built.outlookLiveUrl);
    this.assignOutput("yahooCalendarUrl", built.yahooUrl);
    this.assignOutput("icsContent", built.icsContent);
    this.assignOutput("icsFileName", built.icsFileName);
    this.assignOutput("error", built.error);
  }

  assignOutput(name, value) {
    const next = value || "";
    if (this[name] !== next) {
      this[name] = next;
    }
  }

  logState() {
    const built = this.built;
    const snapshot = this.inputSnapshot();
    const logKey = JSON.stringify({
      snapshot,
      error: built.error,
      hasIcs: Boolean(built.icsContent)
    });
    if (logKey === this._lastLogKey) {
      return;
    }
    this._lastLogKey = logKey;
    if (built.error) {
      console.error(DEBUG_PREFIX, built.error, {
        inputs: snapshot,
        hint: "Start is required. Pass Title, Start, End, All Day, Time Zone, Description, Location, and URL. This component does not read a Salesforce Event."
      });
      return;
    }
    this.debugLog("calendar ready", {
      inputs: snapshot,
      googleUrl: built.googleUrl,
      outlookUrl: built.outlookUrl,
      outlookLiveUrl: built.outlookLiveUrl,
      yahooUrl: built.yahooUrl,
      icsFileName: built.icsFileName,
      icsLength: built.icsContent.length
    });
  }

  debugLog(message, detail) {
    if (this.debug !== true && this.debug !== "true") {
      return;
    }
    console.log(DEBUG_PREFIX, message, detail);
  }

  inputSnapshot() {
    return {
      title: describeValue(this.eventTitle),
      start: describeValue(this.startDateTime),
      end: describeValue(this.endDateTime),
      allDay: this.allDay === true || this.allDay === "true",
      timeZone: describeValue(this.timeZone),
      location: describeValue(this.eventLocation),
      url: describeValue(this.eventUrl),
      uid: describeValue(this.eventUid)
    };
  }

  resolvedUid() {
    if (!isBlank(this.eventUid)) {
      return asText(this.eventUid).trim();
    }
    return this._generatedUid || "";
  }
}

function asText(value) {
  if (value == null) {
    return "";
  }
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (typeof value === "object") {
    const parts = [value.street, value.city, value.state, value.postalCode, value.country].filter(
      (part) => part != null && String(part).trim() !== ""
    );
    return parts.join(", ");
  }
  return "";
}

function describeValue(value) {
  if (value == null || value === "") {
    return "";
  }
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value;
  }
  return asText(value) || "[non-text value]";
}

function isBlank(value) {
  return value == null || String(value).trim() === "";
}

function errorText(error) {
  if (!error) {
    return "";
  }
  if (typeof error === "string") {
    return error;
  }
  return error.message || error.body && error.body.message || "";
}
