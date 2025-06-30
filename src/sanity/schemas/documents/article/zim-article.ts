import { BookIcon } from "@sanity/icons";
import { defineType } from "sanity";
import { format, parseISO } from "date-fns";
import { ArticleFields } from "./index";
import { defineField } from "sanity";
import { INPUT_GROUP, INPUT_GROUPS } from "@/sanity/constants";

export default defineType({
  name: "article",
  title: "Zim Article",
  type: "document",
  icon: BookIcon,
  groups: INPUT_GROUPS,
  fields: [
    ...ArticleFields,
    defineField({
      name: "relatedArticles",
      title: "Related Articles",
      type: "array",
      group: INPUT_GROUP.SEO,
      of: [
        {
          type: "reference",
          to: [{ type: "article" }],
          options: {
            filter: ({ document }: any) => {
              const industryRef = document?.industry?._ref;
              return {
                filter: "industry._ref == $industryRef",
                params: {
                  industryRef,
                },
              };
            },
          },
        },
      ],
      description:
        "These articles will be displayed at the hero so make sure they are related to the topic of this article",
    }),
  ],
  preview: {
    select: {
      title: "name",
      date: "_updatedAt",
      tag: "type",
      media: "seo.image",
      authorName: "author.name",
    },
    prepare({ title, media, date, authorName }) {
      function getNickName(name: string): string {
        if (name === "Tino Mazorodze") return "Tech";

        return name.split(" ")[0]!;
      }

      const subtitles = [
        authorName && `By ${getNickName(authorName)}`,
        date && `on ${format(parseISO(date), "LLL d, yyyy")}`,
      ].filter(Boolean);

      return { title, media, subtitle: subtitles.join(" ") };
    },
  },
});
