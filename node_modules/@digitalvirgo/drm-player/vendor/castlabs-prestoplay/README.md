# PRESTOplay for Web Apps

PRESTOplay for Web Apps is our SDK framework for deploying fantastic HTML/JavaScript
video players across web-enabled platforms.

You can start using PRESTOplay now for your local development, and
visit us [to get your license](https://account.castlabs.com/signup).

Documentation, manuals, tutorials and demos can be found at [https://demo.castlabs.com](https://demo.castlabs.com).

## Installation and getting started

You can install the PRESTOplay SDK using a package manager such as `npm` or `yarn` using:

```
npm install @castlabs/prestoplay
```

Once installed, you can follow the [getting started guide](https://demo.castlabs.com/docs/getting_started) for a full
example, but here is how it would look like:

```javascript
import { clpp } from "@castlabs/prestoplay";
import "@castlabs/prestoplay/cl.mse";
import "@castlabs/prestoplay/cl.dash";

clpp.install(clpp.dash.DashComponent);

const player = new clpp.Player("video");

player.load({
  source: "https://content.players.castlabs.com/demos/clear-segmented/manifest.mpd",
  autoplay: true,
});
```

There is also an accompanying stylesheet that can be found in:

```
node_modules/@castlabs/prestoplay/clpp.styles.css
```


## Support and Help

 * [Documentation](https://demo.castlabs.com/docs)
 * [Demo and Configuration](https://demo.castlabs.com/player/config)
 * [Support and Helpdesk](https://support.castlabs.com/)


## License

 * [Legal terms and conditions](https://castlabs.com/legal/)

