// luxe.config.ts
import { defineLuxeConfig } from "luxecms";
var config = defineLuxeConfig({
  modules: [
    {
      name: "HelloWorldModule"
    }
  ],
  plugins: {}
});
var luxe_config_default = config;
export {
  luxe_config_default as default
};
