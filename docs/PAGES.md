# Add to Calendar on record pages and Experience Cloud

Use this when you place **Add to Calendar** on a Lightning record page, app page, home page, or an Experience Cloud page. Pass event details from any Salesforce record. Start and End pull from Date/Time fields when the component is on a Screen Flow. On the page itself, write them as UTC, or pick them in Experience Builder.

Flow screens are different. There, Start and End are Date/Time values, and you can map record fields and Flow variables. See [FLOW.md](FLOW.md).

## Add it to a Lightning page

These steps are the same for a record page, an app page, and a home page.

1. Open **Lightning App Builder** for the page. From a record, choose **Edit Page**.
2. In the component list, find **Add to Calendar**. In an org where the package is installed, it is under the custom components for namespace `three_levers`.
3. Drag it onto the page.
4. Select the component. The property panel on the right lists every input below.
5. Enter the values. **Start** is the one the button needs.
6. **Save**, then **Activation** if this is the first time the page is used.

The values are part of the page. Every person who opens that page sees the same event. They do not change when you open a different record.

## Add it to an Experience Cloud page

1. Open the site in **Experience Builder**.
2. Open the page.
3. In the components list, find **Add to Calendar** and drag it onto the page.
4. Select the component. Start and End are date and time pickers here. Time Zone is a dropdown, the same list as on a Lightning page.
5. Enter the values.
6. **Publish** the site. Builder changes stay off the live site until you publish.

The page can show the component because it is exposed to Experience Cloud pages. The property panel comes from the default community configuration. If you drop it on a page and the panel has no fields, use a **default** community page region, or put the component on a Flow screen and place that flow on the site. A Flow screen is also how you pass a different value for each visitor. That is described under [When the values should come from a record](#when-the-values-should-come-from-a-record).

## How the panel differs from Flow

| | Flow screen | Lightning page | Experience Cloud |
| --- | --- | --- | --- |
| Start and End | Date/Time fields. You can map a record field or a formula. | Text. App Builder has no date picker for a custom component. Type a UTC value such as `2026-09-29T17:00:00.000Z`. | Date and time pickers. The page stores the time in UTC. |
| Time Zone | Type any named zone, such as `America/Los_Angeles`. | A dropdown of common zones. | The same dropdown. |
| Checkboxes | Map true or false, or leave them unset. | Checkboxes. Checked is true. | Checkboxes. Checked is true. |
| Button Style | Type `neutral`, `brand`, and the other names. | A dropdown of those names. | A dropdown of those names. |
| Record fields | Map each field in the screen. | Not available in the property panel. Use a screen flow on the page when the event should change per record. | Same as a Lightning page. |

## Each property

Labels below are the names in the property panel.

### Title

Text. The calendar event title.

Blank becomes `Event`.

Example: `Follow up Jason at Three Levers`

### Start

Required. The button stays disabled until this is set.

**Experience Cloud.** Date and time picker. Pick the date and time in the time zone you are using in the builder. The page stores that moment in UTC. A person in Pacific time who picks September 29, 2026 at 10:00 a.m. during daylight time stores `2026-09-29T17:00:00.000Z`.

**Lightning app, record, and home pages.** Text. App Builder does not allow a date picker on a custom component, so type the same UTC value:

`2026-09-29T17:00:00.000Z`

That instant is 10:00 a.m. Pacific during daylight time and 9:00 a.m. Pacific during standard time. `2026-09-29` alone is midnight UTC, which is the previous evening in the Americas.

Calendar apps show the instant in each viewer's local time. The Time Zone dropdown does not shift a timed start. It sets the all-day calendar date and the zone Google Calendar displays.

### End

Same form as Start: a picker in Experience Cloud, UTC text on a Lightning page. Clear the picker, or leave the text blank, to leave End empty.

Blank means one hour after Start when All Day is off. When All Day is on, a blank End means the start day only.

For a timed event, End must be after Start. One hour after the Start example is `2026-09-29T18:00:00.000Z`.

For an all-day event, End is the last calendar day, not the next day. The links add one day when they talk to the calendar. Which calendar date the value falls on depends on Time Zone.

### All Day

Checkbox. Off by default.

Off: the event has a start time and an end time, taken from the UTC instants in Start and End.

On: the event is a calendar date. Which date depends on Time Zone, below.

### Time Zone

Dropdown. Common time zones, including `UTC` and `America/Los_Angeles`.

Leave it blank to use UTC for an all-day date. In Flow you can still type any named time zone, such as `America/Los_Angeles`. The page dropdown is this shorter list.

For a timed event, Google Calendar receives the zone you pick as its display zone. The start and end stay at the moments you set.

For an all-day event, this zone chooses the calendar date from those moments. A time near midnight can fall on a different calendar date in another zone.

### Description

Text. The calendar event description.

Blank omits the description. When URL is set, that URL is also appended to the description that Google, Outlook, and Yahoo show.

### Location

Text. The event location, such as `Online` or a street address you type yourself.

Blank omits the location. This box is plain text. It is not a Salesforce Address field.

### URL

Text. A full URL, including `https://`.

Example: `https://threelevers.com/projects/add-to-calendar`

Blank omits it. When set, it is stored on the calendar file and appended to the web calendar description.

One URL fits this field. Put any other links in Description.

### Event UID

Text. Optional stable id for this event.

Blank creates a new id in the browser each time the page loads. Use a fixed value when a later download should refer to the same event, including the Event UID returned by **Send Email with Calendar Event**.

### Button Label

Text. The words on the button.

Blank uses `Add to Calendar`.

### Button Style

Dropdown. Default is **neutral**, a plain button.

| Value | Look |
| --- | --- |
| `neutral` | Plain button |
| `brand` | Blue primary button |
| `brand-outline` | Blue label and border |
| `destructive` | Red button |
| `destructive-text` | Red label and border |
| `success` | Green button |
| `inverse` | Light text for a dark background |
| `base` | Text-style button |

### Show Google Calendar

Checkbox. On by default. Turn it off to hide **Google Calendar**.

### Show Outlook

Checkbox. On by default. Turn it off to hide **Outlook** (Microsoft 365).

### Show Outlook.com

Checkbox. On by default. Turn it off to hide **Outlook.com**.

### Show Yahoo Calendar

Checkbox. On by default. Turn it off to hide **Yahoo Calendar**.

### Show Apple Calendar

Checkbox. On by default. Turn it off to hide **Apple Calendar**.

Apple Calendar downloads the calendar file. Calendar on a Mac or iPhone offers to add the event. There is no Apple web page to open.

### Show Calendar File Download

Checkbox. On by default. Turn it off to hide **Download calendar file**.

That item downloads the same file as Apple Calendar.

### Debug

Checkbox. Off by default.

On: the browser console logs the inputs and the built calendar links under `[addToCalendar]`.

Errors are logged even when this is off.

## Example: a one-hour meeting

| Property | Value |
| --- | --- |
| Title | `Follow up Jason at Three Levers` |
| Start | September 29, 2026, 10:00 a.m. in a Pacific builder |
| End | September 29, 2026, 11:00 a.m. |
| All Day | Off |
| Time Zone | `America/Los_Angeles` |
| Description | `Connect about using Add to Calendar in your organization.` |
| Location | `Online` |
| URL | `https://threelevers.com/projects/add-to-calendar` |
| Button Label | `Add to Calendar` |
| Button Style | `neutral` |

In Pacific daylight time that meeting is 10:00–11:00 a.m. on September 29, 2026.

## Example: an all-day event on one day

| Property | Value |
| --- | --- |
| Title | `Office closed` |
| Start | A time on September 29, 2026 |
| End | Leave blank |
| All Day | On |
| Time Zone | `America/Los_Angeles` |

The calendar day is September 29 in Los Angeles. A blank End keeps the event on that day.

## When the values should come from a record

To pass a different event for each record, put a **Screen Flow** on the record page or on the Experience Cloud page and map Start and End from that record's Date/Time fields.

1. Create a screen flow that includes **Add to Calendar**.
2. On that screen, set each input from the record or from a formula. Start and End are Date/Time values in Flow, not the text form used on the page.
3. Save and activate the flow.
4. On the Lightning record page, add the **Flow** component and select that flow. It receives the record id.
5. On an Experience Cloud page, add the Flow component the site provides and select the same flow. Publish the site.

The field-by-field Flow rules are in [FLOW.md](FLOW.md). **Selected Calendar**, the output that records which menu item was clicked, is available in that flow after Next or Finish. It is not an output of the component sitting directly on the page.
