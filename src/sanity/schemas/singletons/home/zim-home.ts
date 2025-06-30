import { HomeIcon } from "@sanity/icons";
import { defineType } from "sanity";
import { HomeFields } from "./index";

export default defineType({
  name: "home",
  title: "Home",
  icon: HomeIcon,
  type: "document",
  fields: HomeFields,
  preview: {
    select: {
      media: "seo.image",
    },
    prepare({ media }) {
      return { title: "Home", media };
    },
  },
});
