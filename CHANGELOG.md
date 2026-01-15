# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-01-15

### Added
- Initial release of Smart Forms monorepo
- `@much/smart-forms-core` package with UI-agnostic components
  - Schema Factory for declarative form validation
  - `useStepForm` hook for multi-step forms
  - `useSmartInput` hook for input handling
  - Core components: SmartFormContainer, SmartStepIndicator
- `@much/smart-forms-shadcn` adapter for Shadcn/UI
  - SmartInput component
  - SmartCurrencyInput component
  - SmartSelect component
  - SmartCheckbox component
- Complete documentation (Getting Started, API Reference, Migration Guide)
- Example applications

### Features
- Support for multiple field types: text, email, number, currency, cep, uf, boolean, date, phone, cnpj, cpf
- Automatic validation with Zod
- Built-in error handling and clearing
- TypeScript support with full type safety
- Zero UI dependencies in core package

### Notes
- Migrated from CRM BKM project
- Tested and production-ready

## [Unreleased]

### Planned
- CI/CD pipeline
- Unit tests
- Additional UI adapters (MUI, Ant Design)
- Storybook documentation
- NPM publishing automation
