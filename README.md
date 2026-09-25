# Add to Calendar

Flow screen and Lightning page button that adds one event to **Google Calendar**, **Outlook**, **Outlook.com**, **Yahoo Calendar**, or **Apple Calendar**, or downloads a calendar file.

[![License](https://img.shields.io/badge/License-BSD_3--Clause-blue.svg)](LICENSE)
[![Salesforce API](https://img.shields.io/badge/Salesforce_API-65.0-00A1E0)](https://developer.salesforce.com)

---

## Features

Pass event details from any Salesforce record. Start and End pull from Date/Time fields, or are written as UTC.

- Google Calendar, Outlook (Microsoft 365), Outlook.com, and Yahoo Calendar open a prefilled event
- Apple Calendar and Download calendar file save `event.ics`
- Timed events are written in UTC. All-day events use a calendar date in the named time zone
- **Unlocked 2GP package** — install in any org

### Screen Flow

- Map Start and End from Date/Time fields, formulas, or variables on any record
- Type any time zone, such as `America/Los_Angeles`
- Type the button style: `neutral`, `brand`, `brand-outline`, `destructive`, `destructive-text`, `success`, `inverse`, or `base`
- Outputs after Next or Finish: calendar URLs, calendar file text, file name, error, and which calendar was clicked (`google`, `outlook`, `outlookLive`, `yahoo`, `apple`, or `ics`)

### Lightning pages

App pages, record pages, and home pages.

- Write Start and End as UTC, such as `2026-09-29T17:00:00.000Z`
- Time Zone is a dropdown of common zones
- Button style is a dropdown of the same names used in Flow
- The values belong to the page. Place a Screen Flow on the page when each record should pass its own Date/Time fields

### Experience Cloud

- Start and End are date and time pickers. The page stores them as UTC
- Time Zone and button style use the same dropdowns as a Lightning page
- Publish the site after you save. Place a Screen Flow on the page when each visitor or record should pass its own Date/Time fields

---

## Quick start

1. **Install** the unlocked package ([Install](#install-package)) or [deploy from source](docs/INSTALL.md).
2. Open a **Screen Flow** and add **Add to Calendar** to a screen.
3. Set **Start**. Title, end, location, and the other inputs are optional.
4. Run the flow and choose a calendar from the button.

See [Flow configuration](docs/FLOW.md) for Flow inputs and outputs. See [Record pages and Experience Cloud](docs/PAGES.md) for each property you type on those pages.

---

## Public flows and Lightning Flow iframe

Add to Calendar works on a Screen Flow that people can run without logging into Salesforce. Put the button on that flow, then expose the flow on your website with [Lightning Flow iframe](https://github.com/jason-best/lightning-flow-iframe).

1. Build a Screen Flow and add **Add to Calendar** to a screen. Map Start, End, and the other inputs from flow variables.
2. Install **FlowIframeEmbed** and put the `FlowIframeEmbed` Visualforce page on a Salesforce Site. Give the site guest user access to run the flow.
3. On the external page, embed that site URL with `three-levers-flow-embed.js` and pass the flow's API name.

The parent page can pass text into the flow through URL parameters. Those values arrive as text, so convert them in the flow when Start or End should be Date/Time. Product setup is in the [Lightning Flow iframe guide](https://threelevers.com/support/products/lightning-flow-iframe/).

---

## Install package

**Version `0.1.1-1` (released)** · Subscriber version Id `04tgL000000W4A9QAK`

| Org | URL |
|-----|-----|
| Production | https://login.salesforce.com/packaging/installPackage.apexp?p0=04tgL000000W4A9QAK |
| Sandbox | https://test.salesforce.com/packaging/installPackage.apexp?p0=04tgL000000W4A9QAK |

```bash
sf package install --package 04tgL000000W4A9QAK --target-org <alias>
```

After install, the component in Flow and on Lightning pages is **`three_levers__addToCalendar`**.

**Deploy from source:** [docs/INSTALL.md](docs/INSTALL.md)

---

## Requirements

- Salesforce with Lightning and Screen Flows (API 65.0 source)
- No Sites or Named Credentials

---

## Development

```bash
sf org create scratch --definition-file config/project-scratch-def.json --alias add-to-calendar-scratch --set-default
sf project deploy start --manifest manifest/package.xml --target-org add-to-calendar-scratch
```

Packaging and 2GP releases are maintained in the private [ThreeLeversDevOrg](https://github.com/jason-best/ThreeLeversDevOrg) monorepo. Source and docs: [jason-best/sf-add-to-calendar](https://github.com/jason-best/sf-add-to-calendar). See [docs/PACKAGING.md](docs/PACKAGING.md).

---

## License

[BSD 3-Clause](LICENSE) · Copyright Three Levers

---

## Need more features or help with setup

The package covers one event, the calendar menu, and the inputs in [Flow configuration](docs/FLOW.md) and [Record pages and Experience Cloud](docs/PAGES.md). Three Levers can build the surrounding flow and page work, or extend the button for a specific org.

Examples:

- **Record-based event details in Experience Cloud.** A Screen Flow on the site record page maps Start and End from that record's Date/Time fields, and maps title, location, and URL from the record's text fields. Each record then shows its own event. The same pattern works on a Lightning record page.
- **Configuring the flows.** Map the inputs, choose a button style, set all-day versus a timed event, and use **Selected Calendar** after Next or Finish when a later step depends on which calendar was clicked.

For that work, contact Jason Best at Three Levers:

- [threelevers.com/contact](https://threelevers.com/contact/)
- jason@threelevers.com
