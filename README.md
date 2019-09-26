# Project Boilerplate


## Installation

### Requirements

Node.js (use brew or install it from [here](https://nodejs.org/))

### Install the dependencies and devDependencies
```
$ npm i
```


## Usage (commands)

### Develop
```
npm run dev
```

### Production
```
npm run build
```

### Convert pug to html
```
npm run generate-html
```


## Structure
```
├── src/                         # Source
│   ├── components/              # Components
│   │   └── component/           # Component
│   │       ├── component.pug    # Component markup (html)
│   │       ├── component.scss   # Component styles
│   │       └── Component.js     # Component scripts
│   ├── data/                    # JSON data
│   ├── pages/                   # Pages
│   │   └── index.pug            # Page markup (html)
│   ├── svg-icons/               # SVG иконки для генерации векторного спрайта
│   ├── resources/               # Статические файлы для копирования в dist
│   ├── scripts/                 # Scripts
│   │   └── index.js             # Main (root) scripts file
│   └── styles/                  # Styles
│       ├── helpers/             # Помощники
│       │   ├── _mixins.scss     # Mixins
│       │   └── _variables.scss  # Variables
│       └── index.scss           # Main (root) styles file
├── build/                       # Build files
│   ├── assets/                  # Static assets
│   │   ├── fonts/               # Fonts
│   │   ├── images/              # Images
│   │   │   └── sprites/         # Sprites (auto)
│   │   ├── scripts/             # Scripts
│   │   └── styles/              # Styles
│   └── index.html               # Page
├── builder/                     # Building managers configuration files
│   ├── .babelrc                 # Babel configuration
│   ├── index.js                 # Gulp.js configuration
│   ├── server.js                # Express.js server configuration
│   └── webpack.js               # Webpack.js configuration
├── .eslintrc                    # ESLint configuration
├── .gitignore                   # Git's ignored files list
├── .stylelintrc                 # Stylelint configuration
├── browserlist                  # Supporting browsers list
├── package.json                 # Project description file
└── README.md                    # Project documentation
```

