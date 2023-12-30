# STRICH Next.js sample

This repository contains a sample Next.js project with a screen that integrates
the STRICH [BarcodeReader](https://docs.strich.io/reference/classes/BarcodeReader.html)
to read barcodes. The example is configured to read EAN, UPC and QR codes. This
can be changed by adapting the [Configuration](https://docs.strich.io/reference/interfaces/Configuration.html)
in `scanner.tsx`.

The project was generated using `create-next-app` following the instructions
at https://nextjs.org/docs/getting-started.

React StrictMode was disabled, as the example does not yet handle `useEffect`
being called multiple times well.
