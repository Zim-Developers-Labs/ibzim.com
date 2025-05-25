import {
  CheckmarkCircleIcon,
  CloseCircleIcon,
  HelpCircleIcon,
  ImageIcon,
  ImagesIcon,
  PresentationIcon,
  ThListIcon,
} from "@sanity/icons";
import { defineField } from "sanity";
import EcocashLogo from "../../components/icons/ecocash-logo";
import OneMoneyLogo from "../../components/icons/onemoney-logo";
import MukuruLogo from "../../components/icons/mukuru-logo";

export default defineField({
  name: "body",
  title: "Body",
  type: "array",
  of: [
    {
      type: "block",
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          {
            title: "Italic",
            value: "em",
          },
          {
            title: "Strong",
            value: "strong",
          },
          {
            title: "Underline",
            value: "underline",
          },
          {
            title: "Code",
            value: "code",
          },
        ],
        annotations: [
          {
            name: "annotationLink",
            type: "link.annotation",
          },
          {
            name: "annotationInternalLink",
            type: "internalLink.annotation",
          },
          {
            name: "annotationReference",
            type: "reference.annotation",
          },
        ],
      },
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading 1", value: "h1" },
        { title: "Heading 2", value: "h2" },
        { title: "Heading 3", value: "h3" },
        { title: "Heading 4", value: "h4" },
        { title: "Quote", value: "blockquote" },
      ],
    },
    // Custom blocks
    {
      name: "blockGreenCard",
      type: "greenCard.object",
    },
    {
      name: "blockTable",
      type: "table.object",
      icon: ThListIcon,
    },
    {
      name: "blockEmbed",
      type: "embed.object",
    },
    {
      name: "blockFAQs",
      type: "faqs.object",
      icon: HelpCircleIcon,
    },
    {
      name: "blockProsCard",
      type: "prosCard.object",
      icon: CheckmarkCircleIcon,
    },
    {
      name: "blockConsCard",
      type: "consCard.object",
      icon: CloseCircleIcon,
    },
    {
      name: "imageModule",
      type: "image.object",
      icon: ImageIcon,
    },
    {
      name: "imagesModule",
      type: "imageCarousel.object",
      icon: ImagesIcon,
    },
    {
      name: "blockPartnersCard",
      type: "partnersCard.object",
    },
    {
      name: "blockProductSummary",
      type: "productSummary.object",
    },
    {
      name: "blockButtonCta",
      type: "buttonCta.object",
    },
    {
      name: "blockVideoEmbed",
      type: "videoEmbed.object",
      icon: PresentationIcon,
    },
    {
      name: "blockEcocashCalculator",
      type: "ecocashCalculator.object",
      icon: EcocashLogo,
    },
    {
      name: "blockOneMoneyCalculator",
      type: "onemoneyCalculator.object",
      icon: OneMoneyLogo,
    },
    {
      name: "blockMukuruCalculator",
      type: "mukuruCalculator.object",
      icon: MukuruLogo,
    },
  ],
});
