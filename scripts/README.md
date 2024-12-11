# luxe-scripts

The `luxe-scripts` command contains a set of commands useful when developing the Luxe project. These scripts are heavily inspired by [Astro](https://astro.build)'s developer scripts.

## Installation

To install the `luxe-scripts` command in any package in this repository, add the following to your `devDependencies` in your `package.json`:

```json
{
  "devDependencies": {
    "luxe-scripts": "workspace:*"
  }
}
```

## Usage

To use the `luxe-scripts` command, you can run the following command in the root of the package you want to run the command in:

```sh
pnpm luxe-scripts <command> [options]
```

### Commands

| Command | Description                            | Options                       |
| ------- | -------------------------------------- | ----------------------------- |
| `build` | Builds the package.                    | `--dts`, `--verbose`, `--dev` |
| `dev`   | Watch for file changes and then build. | `--dts`, `--verbose`          |

### Options

| Option      | Description                                      |
| ----------- | ------------------------------------------------ |
| `--dts`     | Generate TypeScript declaration files.           |
| `--dev`     | Watch for file changes in the package and build. |
| `--verbose` | Show more detailed output.                       |

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.
