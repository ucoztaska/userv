# uServ

Check the status of the uCoz/Narod/uWeb servers from the CLI. This tool is useful if you want to find out whether only your website is down or the entire server your website is hosted on. You can also automate it for monitoring if you want to get creative.

## Requirements

To run this application, you must have Node.js and npm installed.

## Installation

Use npm to install the program:

```sh
npm i -g userv
```

## Usage

To check the status of a server by name:

```
userv check s32
```

To check the status of a server by IP address:

```
userv check 195.216.243.232
```

To get the server status of all servers:

```
userv all
```

## Development

The program was written in Typescript and uses [oclif](https://oclif.io/).

To make a change, you must first clone the repository:

```
git clone git@github.com:ucoztaska/userv.git
cd userv
```

Install the dependencies using Yarn:
```
npm i -g yarn
yarn
```

After making your changes, you can check them by running `./bin/run <command> <args>`.

Tests aren't currently available but very likely will be in the future. If you want to help out with tests, you can do that as well!

Linting must pass before submitting a PR:

```
yarn lint
```

## License

MIT