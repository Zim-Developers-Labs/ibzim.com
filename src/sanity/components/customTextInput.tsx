"use client";

import { Stack, Text, TextArea } from "@sanity/ui";

export const MyCustomTextArea = (props: any) => {
  const { elementProps, value = "" } = props;

  return (
    <Stack space={2}>
      <TextArea {...elementProps} />
      <Text style={{ fontSize: "12px", marginLeft: "auto" }}>
        Characters: {value.length}
      </Text>
    </Stack>
  );
};
