import { PresentationIcon } from "@sanity/icons";
import { defineType } from "sanity";

export default defineType({
  name: "videoEmbed.object",
  title: "Video Embed",
  type: "document",
  icon: PresentationIcon,
  fields: [
    {
      name: "name",
      type: "string",
      title: "Name",
    },
    {
      name: "status",
      type: "string",
      title: "Status",
      initialValue: "ready",
      readOnly: true,
    },
    {
      name: "provider",
      type: "string",
      title: "Provider",
      initialValue: "mux",
      readOnly: true,
    },
    {
      name: "providerMetadata",
      title: "Provider Metadata",
      type: "object",
      fields: [
        {
          name: "mux",
          title: "Mux",
          type: "object",
          fields: [
            {
              name: "uploadId",
              title: "Upload ID",
              type: "string",
            },
            {
              name: "assetId",
              title: "Asset ID",
              type: "string",
            },
            {
              name: "playbackId",
              title: "Playback ID",
              type: "string",
            },
          ],
        },
      ],
    },
    {
      name: "createdAt",
      title: "Created At",
      type: "number", // Using 'number' for Unix timestamp
    },
    {
      name: "updatedAt",
      title: "Updated At",
      type: "number", // Using 'number' for Unix timestamp
    },
    {
      name: "size",
      title: "Size",
      type: "number", // Size in bytes
    },
    {
      name: "sources",
      title: "Sources",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "src",
              title: "Source URL",
              type: "url",
            },
            {
              name: "type",
              title: "Type",
              type: "string",
            },
          ],
        },
      ],
    },
    {
      name: "poster",
      title: "Poster URL",
      type: "string",
    },
    {
      name: "blurDataURL",
      title: "Blur Data URL",
      type: "string",
    },
  ],
  preview: {
    select: {
      name: "name",
    },
    prepare({ name }) {
      return { title: name };
    },
  },
});
