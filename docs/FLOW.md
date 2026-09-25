# Flow and page configuration

Add **Add to Calendar** to a Screen Flow screen, or to a Lightning app, record, or home page. Pass each value in. The component does not read a Salesforce Event or any other record.

## Component names

| Install method | Name in Flow Builder |
|----------------|----------------------|
| Unlocked package (`AddToCalendar`) | `three_levers__addToCalendar` |
| Deploy from source (namespaced scratch) | `addToCalendar` |
| Unpackaged (`c:` namespace) | `c:addToCalendar` |

Experience Cloud page templates (`lightningCommunity__Page`) can include the component, and that target does not accept design properties. Pass the values from a Flow screen instead. Default community pages (`lightningCommunity__Default`) accept the same properties as Lightning pages.

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
