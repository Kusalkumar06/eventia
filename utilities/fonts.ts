import { Syne, Plus_Jakarta_Sans, Lobster, Teko } from "next/font/google";

export const lobster = Lobster({
  weight: '400',
  subsets: ['vietnamese']
})

export const teko = Teko({
  weight: '300',
  subsets: ['devanagari']
})

export const fontHeading = Syne({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const fontSubheading = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-subheading",
});

export const fontParagraphStack = '"Gill Sans MT", Calibri, "Trebuchet MS", sans-serif';
