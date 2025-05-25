import { defineField } from "sanity";
import OneMoneyLogo from "../../../components/icons/onemoney-logo";

export default defineField({
  name: "onemoneyCalculator.object",
  title: "OneMoney Calculator",
  type: "object",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
      initialValue: "OneMoney Charges Calculator",
      readOnly: true,
    },
    {
      name: "lastUpdated",
      title: "Last Updated",
      type: "date",
    },
  ],
  preview: {
    select: {
      lastUpdated: "lastUpdated",
    },
    prepare(selection) {
      const { lastUpdated } = selection;

      return {
        title: "OneMoney Charges Calculator 2024",
        subtitle: lastUpdated,
        media: OneMoneyLogo,
      };
    },
  },
});
