# Guessy

![Build status](https://github.com/electrofLy/guessy/actions/workflows/ci.yml/badge.svg)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=electrofLy_guessy&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=electrofLy_guessy)

![Guessy](./src/assets/icons/icon-48x48.png)

Guessy is an Angular-based game where players are given the task of guessing a country's flag or its geographical region shape. This educational game makes learning about the world fun and engaging!

## Technologies Used

- Angular
- ESLint
- Prettier
- Jest
- Cypress
- Tailwind
- GitHub Actions

## Features

- Guess a country by its flag
- Guess a country by its region shape
- Settings - language and theme
- Adaptive design for mobile and desktop

## Installation

To get the project up and running on your own machine:

```bash
git clone https://github.com/electrofLy/guessy.git
cd guessy
npm install
ng serve
```

Then navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Testing

Unit tests are written with Jest and can be run with:

```bash
npm run test
```

End-to-end tests are written with Cypress and can be run with:

```bash
npm run ct
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
