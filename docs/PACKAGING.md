# Packaging (2GP)

**This public repo** is for source distribution, documentation, and deploy-from-source.

**2GP package builds** (`package version create`, promote, subscriber version Ids) are done from the private **ThreeLeversDevOrg** monorepo:

- Package name: `AddToCalendar`
- Package path: `force-app/package-add-to-calendar/` (LWC `addToCalendar`)
- Internal docs: `docs/add-to-calendar.md`
- Sync: `scripts/sync-package-add-to-calendar.ps1` (main → package)
- Public sync: `scripts/sync-public-add-to-calendar.ps1` (main → this repo)

When a new package version is released, update the install URLs in [README.md](../README.md) and [docs/INSTALL.md](INSTALL.md) with the new `04t…` subscriber version Id.

Do not run `package version create` from this repo clone alone unless you have configured the same Dev Hub and package directory layout.
