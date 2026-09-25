# Flow and page configuration

Pass event details from any Salesforce record. On a Screen Flow, Start and End pull from Date/Time fields, formulas, or variables. On a Lightning page, write Start and End as UTC. In Experience Cloud, pick Start and End and the page stores them as UTC.

## Component names

| Install method | Name in Flow Builder |
|----------------|----------------------|
| Unlocked package (`AddToCalendar`) | `three_levers__addToCalendar` |
| Deploy from source (namespaced scratch) | `addToCalendar` |
| Unpackaged (`c:` namespace) | `c:addToCalendar` |

On a record page or in Experience Cloud, type each value in the property panel. That guide is [PAGES.md](PAGES.md).

## Menu

| Choice | What it does |
|--------|----------------|
| Google Calendar | Opens a prefilled Google Calendar event |
| Outlook | Opens Outlook on the web (Microsoft 365) |
| Outlook.com | Opens Outlook.com |
| Yahoo Calendar | Opens a prefilled Yahoo Calendar event |
| Apple Calendar | Downloads `event.ics`. Calendar on a Mac or iPhone offers to add the event |
| Download calendar file | Downloads the same `event.ics` file |

## Inputs

**Start** is the only required input. Without it the button is disabled and **Error** is `A start date is required.`

| Input | Required | When it is blank |
| --- | --- | --- |
| Start | Yes | The button is disabled and Error is `A start date is required.` |
| Title | No | Calendar title becomes `Event`. |
| End | No | Timed events last one hour. All-day events last that start day only. |
| All Day | No | Treated as false (a timed event). |
| Time Zone | No | All-day dates use the UTC date. Timed events are still written in UTC. Google Calendar does not get a `ctz` value. |
| Description | No | Omitted. |
| Location | No | Omitted. Must be text, such as Billing Street. An Address field such as Billing Address makes the Flow screen fail. |
| URL | No | Omitted. When set, stored on the calendar file and appended to the web calendar description. |
| Event UID | No | A new id is created in the browser. Pass the Event UID from **Send Email with Calendar Event** when this file should refer to that emailed event. |
| Button Label | No | `Add to Calendar`. |
| Button Style | No | `neutral`. In Flow, type `neutral`, `brand`, `brand-outline`, `destructive`, `destructive-text`, `success`, `inverse`, or `base`. On a Lightning page the same values are a dropdown. |
| Show Google / Outlook / Outlook.com / Yahoo / Apple / Calendar File | No | Shown. Set one to false to hide that menu item. |
| Debug | No | False. Errors are still written to the browser console under `[addToCalendar]`. |

Start and End in Flow are Date/Time values. On a Lightning page they are text, for example `2026-09-24T18:00:00.000Z`. An all-day End is the last day of the event. The links use the next day as the exclusive end.

Timed events are written in UTC. All-day events use a calendar date in the named time zone, or the UTC date when Time Zone is blank.

## Outputs

Store automatically on the screen element, or assign to Flow variables.

| Output | Notes |
|--------|-------|
| Google Calendar URL, Outlook URL, Outlook.com URL, Yahoo Calendar URL | Blank when Start is missing or invalid. |
| Calendar File Text | `.ics` contents (`METHOD:PUBLISH`). |
| Calendar File Name | `event.ics` |
| Error | Blank when the event is valid. |
| Selected Calendar | `google`, `outlook`, `outlookLive`, `yahoo`, `apple`, or `ics`. Blank when nothing was clicked. |

The click does not move the flow forward. **Selected Calendar** is available after Next or Finish. A later click replaces the earlier one. Use it in a Decision, or save it to a field.

## Record pages and Experience Cloud

How to set every property on a record page, app page, home page, or Experience Cloud page is in [PAGES.md](PAGES.md). Experience Builder uses date and time pickers for Start and End. Lightning pages use UTC text for those two fields. Time Zone is a dropdown in both. The panel does not map record fields.
