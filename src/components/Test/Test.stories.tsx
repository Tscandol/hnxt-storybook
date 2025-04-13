import type { Meta, StoryObj } from "@storybook/react";
import { TailwindTest } from "./index";

const meta = {
  title: "Test/TailwindTest",
  component: TailwindTest,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof TailwindTest>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
