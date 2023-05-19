# Guessy

![GitHub stars](https://img.shields.io/github/stars/electrofly/guessy)
![GitHub forks](https://img.shields.io/github/forks/electrofly/guessy)
![GitHub issues](https://img.shields.io/github/issues/electrofly/guessy)
![GitHub pull requests](https://img.shields.io/github/issues-pr/electrofly/guessy)
![GitHub license](https://img.shields.io/github/license/electrofly/guessy)
![Build status](https://github.com/electrofly/guessy/actions/workflows/ci.yml/badge.svg)
![Code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)

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
git clone https://github.com/electrofly/guessy.git
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
npm run cypress:run
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
