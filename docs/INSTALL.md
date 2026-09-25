# Installation

## Option A — Install unlocked package (recommended)

**Version:** `0.1.1-1` (released)  
**Subscriber package version Id:** `04tgL000000W4A9QAK`

| Org type | Install URL |
|----------|-------------|
| Production | https://login.salesforce.com/packaging/installPackage.apexp?p0=04tgL000000W4A9QAK |
| Sandbox | https://test.salesforce.com/packaging/installPackage.apexp?p0=04tgL000000W4A9QAK |

CLI:

```bash
sf package install --package 04tgL000000W4A9QAK --target-org <alias>
```

No installation key. After install, use **`three_levers__addToCalendar`** in Flow Builder and in Lightning App Builder.

## Option B — Deploy from source

### Namespaced scratch org (matches package)

```bash
sf org create scratch --definition-file config/project-scratch-def.json --alias add-to-calendar-scratch --set-default
sf project deploy start --manifest manifest/package.xml --target-org add-to-calendar-scratch
```

Component name in Flow: **`addToCalendar`** (scratch namespace) or **`three_levers__addToCalendar`** when installed from the package.

### Unpackaged deploy (no namespace)

Remove or omit `"namespace"` in `sfdx-project.json`, then deploy to your dev org:

```bash
sf project deploy start --manifest manifest/package.xml --target-org <alias>
```

Component name in Flow: **`c:addToCalendar`**.

## Post-install

Nothing required beyond Flow or Lightning page access. No Sites, guest profiles, or Named Credentials.

Pass **Start** and any other event details on the component. See [FLOW.md](FLOW.md).

## Upgrade

Install a newer package version from the [README](../README.md#install-package) or redeploy from source. Unlocked packages allow subscriber customization of the LWC after install.
