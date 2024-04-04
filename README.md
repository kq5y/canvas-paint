# canvas-paint

canvas-paint is a versatile drawing application built with Vite, TypeScript, and React.
It utilizes the HTML canvas element and the CanvasRenderingContext2D API to provide a feature-rich drawing experience based on mouse input.

## Features

-   Various drawing tools, including pencil, eraser, and more.
-   Layer functionality for organizing and managing your drawings.
-   Extensible tool architecture: New drawing tools can be created by extending the `BrushBase` class.

## TODO

-   Pressure sensitivity support for drawing tools.
-   Touch event handling for drawing on touch-enabled devices.

## Getting Started

To run the application locally, follow these steps:

```shell
git clone https://github.com/tkser/canvas-paint.git
cd canvas-paint
pnpm install
pnpm dev
```

The application should now be accessible at `http://localhost:5173`.

## License

This project is licensed under the [MIT License](LICENSE).
