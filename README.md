# Add to Calendar

Flow screen and Lightning page button that adds one event to **Google Calendar**, **Outlook**, **Outlook.com**, **Yahoo Calendar**, or **Apple Calendar**, or downloads a calendar file.

[![License](https://img.shields.io/badge/License-BSD_3--Clause-blue.svg)](LICENSE)
[![Salesforce API](https://img.shields.io/badge/Salesforce_API-65.0-00A1E0)](https://developer.salesforce.com)

---

## Features

- Screen Flow and Lightning page button menu
- Google Calendar, Outlook (Microsoft 365), Outlook.com, and Yahoo Calendar open a prefilled event
- Apple Calendar and Download calendar file save `event.ics`
- Pass every value in. The component does not read a Salesforce record
- Timed events are written in UTC. All-day events use a calendar date in the named time zone
- Flow outputs the calendar URLs, the calendar file text, the file name, and an error message
- **Unlocked 2GP package** — install in any org

---

## Quick start

1. **Install** the unlocked package ([Install](#install-package)) or [deploy from source](docs/INSTALL.md).
2. Open a **Screen Flow** and add **Add to Calendar** to a screen.
3. Set **Start**. Title, end, location, and the other inputs are optional.
4. Run the flow and choose a calendar from the button.

See [Flow and page configuration](docs/FLOW.md) for every input and output.

---

## Install package

**Version `0.1.0-2` (released)** · Subscriber version Id `04tgL000000W2rVQAS`

| Org | URL |
|-----|-----|
| Production | https://login.salesforce.com/packaging/installPackage.apexp?p0=04tgL000000W2rVQAS |
| Sandbox | https://test.salesforce.com/packaging/installPackage.apexp?p0=04tgL000000W2rVQAS |

```bash
sf package install --package 04tgL000000W2rVQAS --target-org <alias>
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

## Support

Questions or consulting: [threelevers.com/contact](https://threelevers.com/contact/)
