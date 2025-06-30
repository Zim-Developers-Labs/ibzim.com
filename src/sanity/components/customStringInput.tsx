"use client";

// /components/MyCustomStringInput.jsx
import { Stack, Text, TextInput } from "@sanity/ui";

export const MyCustomStringInput = (props: any) => {
  const { elementProps, value = "" } = props;

  return (
    <Stack space={2}>
      <TextInput {...elementProps} />
      <Text style={{ fontSize: "12px", marginLeft: "auto" }}>
        Characters: {value.length}
      </Text>
    </Stack>
  );
};
