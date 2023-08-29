# v3.0.5 (Tue Aug 29 2023)

#### ⚠️ Pushed to `master`

- New version of library with less dependencies ([@bmxpiku](https://github.com/bmxpiku))
- Update module to promise like v1 ([@bmxpiku](https://github.com/bmxpiku))
- Update version 2.0.1 -> 2.1.0 ([@eduardbme](https://github.com/eduardbme))
- Remove assert statement to allow result from dns.resolve* to be empty, add tests ([@eduardbme](https://github.com/eduardbme))
- Fix npm audit security reports ([@eduardbme](https://github.com/eduardbme))
- Run prettier ([@eduardbme](https://github.com/eduardbme))
- Refactor code, add tests ([@eduardbme](https://github.com/eduardbme))
- Remove old files ([@eduardbme](https://github.com/eduardbme))
- Refactoring code, add tests ([@eduardbme](https://github.com/eduardbme))
- Fix bugs, refactoring ([@eduardbme](https://github.com/eduardbme))
- 1.0.1 ([@eduardbme](https://github.com/eduardbme))
- Minor organizational changes ([@eduardbme](https://github.com/eduardbme))
- Update README.md file ([@eduardbme](https://github.com/eduardbme))
- Update package information ([@eduardbme](https://github.com/eduardbme))
- Initial commit ([@eduardbme](https://github.com/eduardbme))

#### Authors: 2

- Eduard Bondarenko ([@eduardbme](https://github.com/eduardbme))
- Piotr Kurek ([@bmxpiku](https://github.com/bmxpiku))

---



# Changelog

### Version 3.0.0
  - Add auto package for releases
  - Replace istanbul with nyc
  - Remove lodash dependency
  - Remove async dependency in favour of `Promise.all` parallel processing
  - Change README example to node-fetch
  - Create node.js.yml for automated checks
  - Update all tests
  - Upgrade npm devpendencies
  - Replace node:dns resolve4/resolve6 with Tangerine library DNS over HTTPS approach

## [Unreleased]

### Added

- CHANGELOG