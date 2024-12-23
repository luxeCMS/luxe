import { defineConfig, ObjectsModule } from "luxecms";
import {
  DocumentModule,
  WidgetModule,
  MediaModule,
  PageModule,
} from "luxecms/modules";
import { text, number, paragraph } from "luxecms/fields";

export default defineConfig({
  postgresUrl: process.env.POSTGRES_URL ?? "",
  modules: [
    DocumentModule({
      fields: [text(), number(), paragraph()],
      types: [address],
      documents: [user],
    }),
    WidgetModule({
      renderer: "https://mysite.com/api/render",
      widgetFolder: "widgets-react",
    }),
    WidgetModule({
      renderer: "https://mysite.com/api/render",
      widgetFolder: "widgets-vue",
    }),
    MediaModule({
      domain: "https://mysite.com",
    }),
    PageModule(),
  ],
});
