import type { Meta, StoryObj } from "@storybook/react";
import { Alert } from "./index";

const meta = {
  title: "Components/Alert",
  component: Alert,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    severity: {
      control: "select",
      options: ["info", "warning", "error"],
      description: "Niveau de sévérité de l'alerte",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "info" },
      },
    },
    fullWidth: {
      control: "boolean",
      description: "L'alerte occupe toute la largeur disponible",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "true" },
      },
    },
    title: {
      control: "text",
      description: "Titre de l'alerte (optionnel)",
      table: {
        type: { summary: "string" },
      },
    },
    children: {
      control: "text",
      description: "Contenu de l'alerte",
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    severity: "info",
    children: "Ceci est une alerte informative.",
  },
};

export const Warning: Story = {
  args: {
    severity: "warning",
    children: "Attention! Cette action nécessite votre vigilance.",
  },
};

export const Error: Story = {
  args: {
    severity: "error",
    children: "Une erreur est survenue lors du traitement de votre demande.",
  },
};

export const WithTitle: Story = {
  args: {
    severity: "info",
    title: "Information importante",
    children: "Votre demande a bien été prise en compte.",
  },
};

export const CustomWidth: Story = {
  args: {
    severity: "info",
    fullWidth: false,
    children: "Cette alerte a une largeur fixe de 400px.",
  },
};
