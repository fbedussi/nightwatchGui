# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0]

## Added
- "Edit file" button to open feature files in the system text editor and edit them on the fly - [issue](https://github.com/fbedussi/nightwatchGui/issues/4)

## [1.1.5]

## Changed

- Folders and Features in alphabetical order

## [1.1.3]

## Changed

- light graphical revamp
- build chain

## [1.1.2]

### Added

- `CHANGELOG.md` to keep track of changes and versions
- `nightwatch-gui` as a command to launch the module

### Changed

- Removed nightwatch dependency, now the module simply assumes that it will be invoked in a folder containing a `node_module` subfolder with `nightwatch` in it

### Security

- Sanitized port address to prevent command injection, as suggested in the [open security documentation](https://www.npmjs.com/advisories/663)