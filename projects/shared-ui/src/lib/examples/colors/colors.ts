import { Component, input } from '@angular/core';
import { cssUtils } from '@organization/shared-utils';

type ColorVariable = {
  name: string;
  cssVar: string;
  description?: string;
  backgroundColorVar?: string;
};

type ColorCategory = {
  title: string;
  colors: ColorVariable[];
};

@Component({
  selector: 'org-examples-colors',
  imports: [],
  templateUrl: './colors.html',
  styleUrl: './colors.css',
})
export class EXAMPLEColors {
  public mergeClasses = cssUtils.merge;

  public defaultBackgroundColor = input<string>();
  protected readonly colorCategories: ColorCategory[] = [
    {
      title: 'Text Colors',
      colors: [
        { name: 'Text', cssVar: '--color-text', description: 'Primary text color' },
        { name: 'Text Subtle', cssVar: '--color-text-subtle', description: 'Subtle text with opacity' },
        { name: 'Text Disabled', cssVar: '--color-text-disabled', description: 'Disabled text with reduced opacity' },
        {
          name: 'Text Inverse',
          cssVar: '--color-text-inverse',
          description: 'Inverse text color for dark backgrounds',
          backgroundColorVar: '--color-background-inverse',
        },
        {
          name: 'Text Inverse Subtle',
          cssVar: '--color-text-inverse-subtle',
          description: 'Subtle inverse text',
          backgroundColorVar: '--color-background-inverse',
        },
        { name: 'Primary Text', cssVar: '--color-primary-text', description: 'Primary color for text' },
        { name: 'Primary Text Subtle', cssVar: '--color-primary-text-subtle', description: 'Subtle primary text' },
        { name: 'Secondary Text', cssVar: '--color-secondary-text', description: 'Secondary text color' },
        {
          name: 'Secondary Text Subtle',
          cssVar: '--color-secondary-text-subtle',
          description: 'Subtle secondary text',
        },
        { name: 'Safe Text', cssVar: '--color-safe-text', description: 'Success/safe state text' },
        { name: 'Safe Text Subtle', cssVar: '--color-safe-text-subtle', description: 'Subtle safe text' },
        { name: 'Info Text', cssVar: '--color-info-text', description: 'Information state text' },
        { name: 'Info Text Subtle', cssVar: '--color-info-text-subtle', description: 'Subtle info text' },
        { name: 'Caution Text', cssVar: '--color-caution-text', description: 'Caution state text' },
        { name: 'Caution Text Subtle', cssVar: '--color-caution-text-subtle', description: 'Subtle caution text' },
        { name: 'Warning Text', cssVar: '--color-warning-text', description: 'Warning state text' },
        { name: 'Warning Text Subtle', cssVar: '--color-warning-text-subtle', description: 'Subtle warning text' },
        { name: 'Danger Text', cssVar: '--color-danger-text', description: 'Error/danger state text' },
        { name: 'Danger Text Subtle', cssVar: '--color-danger-text-subtle', description: 'Subtle danger text' },
        { name: 'Lime Text', cssVar: '--color-lime-text', description: 'Lime color text' },
        { name: 'Lime Text Subtle', cssVar: '--color-lime-text-subtle', description: 'Subtle lime text' },
        { name: 'Teal Text', cssVar: '--color-teal-text', description: 'Teal color text' },
        { name: 'Teal Text Subtle', cssVar: '--color-teal-text-subtle', description: 'Subtle teal text' },
        { name: 'Indigo Text', cssVar: '--color-indigo-text', description: 'Indigo color text' },
        { name: 'Indigo Text Subtle', cssVar: '--color-indigo-text-subtle', description: 'Subtle indigo text' },
        { name: 'Fuchsia Text', cssVar: '--color-fuchsia-text', description: 'Fuchsia color text' },
        { name: 'Fuchsia Text Subtle', cssVar: '--color-fuchsia-text-subtle', description: 'Subtle fuchsia text' },
      ],
    },
    {
      title: 'Link Colors',
      colors: [
        { name: 'Link', cssVar: '--color-link', description: 'Default link color' },
        { name: 'Link Hover', cssVar: '--color-link-hover', description: 'Link hover state' },
        { name: 'Link Pressed', cssVar: '--color-link-pressed', description: 'Link pressed state' },
        { name: 'Link Visited', cssVar: '--color-link-visited', description: 'Visited link color' },
        { name: 'Link Visited Hover', cssVar: '--color-link-visited-hover', description: 'Visited link hover state' },
        {
          name: 'Link Visited Pressed',
          cssVar: '--color-link-visited-pressed',
          description: 'Visited link pressed state',
        },
      ],
    },
  ];

  protected readonly borderColors: ColorCategory[] = [
    {
      title: 'Basic Border Colors',
      colors: [
        { name: 'Input Border', cssVar: '--color-input-border', description: 'Default input border' },
        { name: 'Input Border Focused', cssVar: '--color-input-border-focused', description: 'Focused input border' },
        { name: 'Border', cssVar: '--color-border', description: 'Default border color' },
        { name: 'Border Subtle', cssVar: '--color-border-subtle', description: 'Subtle border color' },
        { name: 'Border Bold', cssVar: '--color-border-bold', description: 'Bold border color' },
      ],
    },
    {
      title: 'Primary & Secondary Border Colors',
      colors: [
        { name: 'Primary Border', cssVar: '--color-primary-border', description: 'Primary border color' },
        {
          name: 'Primary Border Subtle',
          cssVar: '--color-primary-border-subtle',
          description: 'Subtle primary border',
        },
        { name: 'Primary Border Bold', cssVar: '--color-primary-border-bold', description: 'Bold primary border' },
        { name: 'Secondary Border', cssVar: '--color-secondary-border', description: 'Secondary border color' },
        {
          name: 'Secondary Border Subtle',
          cssVar: '--color-secondary-border-subtle',
          description: 'Subtle secondary border',
        },
        {
          name: 'Secondary Border Bold',
          cssVar: '--color-secondary-border-bold',
          description: 'Bold secondary border',
        },
        { name: 'Neutral Border', cssVar: '--color-neutral-border', description: 'Neutral border color' },
        {
          name: 'Neutral Border Subtle',
          cssVar: '--color-neutral-border-subtle',
          description: 'Subtle neutral border',
        },
        { name: 'Neutral Border Bold', cssVar: '--color-neutral-border-bold', description: 'Bold neutral border' },
      ],
    },
    {
      title: 'State Border Colors',
      colors: [
        { name: 'Safe Border', cssVar: '--color-safe-border', description: 'Safe state border' },
        { name: 'Safe Border Subtle', cssVar: '--color-safe-border-subtle', description: 'Subtle safe border' },
        { name: 'Safe Border Bold', cssVar: '--color-safe-border-bold', description: 'Bold safe border' },
        { name: 'Info Border', cssVar: '--color-info-border', description: 'Info state border' },
        { name: 'Info Border Subtle', cssVar: '--color-info-border-subtle', description: 'Subtle info border' },
        { name: 'Info Border Bold', cssVar: '--color-info-border-bold', description: 'Bold info border' },
        { name: 'Caution Border', cssVar: '--color-caution-border', description: 'Caution state border' },
        {
          name: 'Caution Border Subtle',
          cssVar: '--color-caution-border-subtle',
          description: 'Subtle caution border',
        },
        { name: 'Caution Border Bold', cssVar: '--color-caution-border-bold', description: 'Bold caution border' },
        { name: 'Warning Border', cssVar: '--color-warning-border', description: 'Warning state border' },
        {
          name: 'Warning Border Subtle',
          cssVar: '--color-warning-border-subtle',
          description: 'Subtle warning border',
        },
        { name: 'Warning Border Bold', cssVar: '--color-warning-border-bold', description: 'Bold warning border' },
        { name: 'Danger Border', cssVar: '--color-danger-border', description: 'Danger state border' },
        { name: 'Danger Border Subtle', cssVar: '--color-danger-border-subtle', description: 'Subtle danger border' },
        { name: 'Danger Border Bold', cssVar: '--color-danger-border-bold', description: 'Bold danger border' },
      ],
    },
    {
      title: 'Extended Border Colors',
      colors: [
        { name: 'Lime Border', cssVar: '--color-lime-border', description: 'Lime border color' },
        { name: 'Lime Border Subtle', cssVar: '--color-lime-border-subtle', description: 'Subtle lime border' },
        { name: 'Lime Border Bold', cssVar: '--color-lime-border-bold', description: 'Bold lime border' },
        { name: 'Teal Border', cssVar: '--color-teal-border', description: 'Teal border color' },
        { name: 'Teal Border Subtle', cssVar: '--color-teal-border-subtle', description: 'Subtle teal border' },
        { name: 'Teal Border Bold', cssVar: '--color-teal-border-bold', description: 'Bold teal border' },
        { name: 'Indigo Border', cssVar: '--color-indigo-border', description: 'Indigo border color' },
        { name: 'Indigo Border Subtle', cssVar: '--color-indigo-border-subtle', description: 'Subtle indigo border' },
        { name: 'Indigo Border Bold', cssVar: '--color-indigo-border-bold', description: 'Bold indigo border' },
        { name: 'Fuchsia Border', cssVar: '--color-fuchsia-border', description: 'Fuchsia border color' },
        {
          name: 'Fuchsia Border Subtle',
          cssVar: '--color-fuchsia-border-subtle',
          description: 'Subtle fuchsia border',
        },
        { name: 'Fuchsia Border Bold', cssVar: '--color-fuchsia-border-bold', description: 'Bold fuchsia border' },
      ],
    },
  ];

  protected readonly backgroundColors: ColorCategory[] = [
    {
      title: 'Base Background Colors',
      colors: [
        { name: 'Background', cssVar: '--color-background', description: 'Primary background color' },
        { name: 'Background Inverse', cssVar: '--color-background-inverse', description: 'Inverse background color' },
        {
          name: 'Overlay Background',
          cssVar: '--color-overlay-background',
          description: 'Overlay background with opacity',
        },
        {
          name: 'Overlay Danger Background',
          cssVar: '--color-overlay-danger-background',
          description: 'Danger overlay background',
        },
        {
          name: 'Skeleton Background',
          cssVar: '--color-skeleton-background',
          description: 'Skeleton loading background',
        },
        {
          name: 'Skeleton Background Subtle',
          cssVar: '--color-skeleton-background-subtle',
          description: 'Subtle skeleton background',
        },
      ],
    },
    {
      title: 'Primary Background Colors',
      colors: [
        { name: 'Primary Background', cssVar: '--color-primary-background', description: 'Primary background color' },
        {
          name: 'Primary Background Hover',
          cssVar: '--color-primary-background-hover',
          description: 'Primary background hover state',
        },
        {
          name: 'Primary Background Pressed',
          cssVar: '--color-primary-background-pressed',
          description: 'Primary background pressed state',
        },
        {
          name: 'Primary Background Subtle',
          cssVar: '--color-primary-background-subtle',
          description: 'Subtle primary background',
        },
        {
          name: 'Primary Background Hover Subtle',
          cssVar: '--color-primary-background-hover-subtle',
          description: 'Subtle primary background hover',
        },
        {
          name: 'Primary Background Pressed Subtle',
          cssVar: '--color-primary-background-pressed-subtle',
          description: 'Subtle primary background pressed',
        },
        {
          name: 'Primary Background Bold',
          cssVar: '--color-primary-background-bold',
          description: 'Bold primary background',
        },
        {
          name: 'Primary Background Hover Bold',
          cssVar: '--color-primary-background-hover-bold',
          description: 'Bold primary background hover',
        },
        {
          name: 'Primary Background Pressed Bold',
          cssVar: '--color-primary-background-pressed-bold',
          description: 'Bold primary background pressed',
        },
      ],
    },
    {
      title: 'Secondary Background Colors',
      colors: [
        {
          name: 'Secondary Background',
          cssVar: '--color-secondary-background',
          description: 'Secondary background color',
        },
        {
          name: 'Secondary Background Hover',
          cssVar: '--color-secondary-background-hover',
          description: 'Secondary background hover state',
        },
        {
          name: 'Secondary Background Pressed',
          cssVar: '--color-secondary-background-pressed',
          description: 'Secondary background pressed state',
        },
        {
          name: 'Secondary Background Subtle',
          cssVar: '--color-secondary-background-subtle',
          description: 'Subtle secondary background',
        },
        {
          name: 'Secondary Background Hover Subtle',
          cssVar: '--color-secondary-background-hover-subtle',
          description: 'Subtle secondary background hover',
        },
        {
          name: 'Secondary Background Pressed Subtle',
          cssVar: '--color-secondary-background-pressed-subtle',
          description: 'Subtle secondary background pressed',
        },
        {
          name: 'Secondary Background Bold',
          cssVar: '--color-secondary-background-bold',
          description: 'Bold secondary background',
        },
        {
          name: 'Secondary Background Hover Bold',
          cssVar: '--color-secondary-background-hover-bold',
          description: 'Bold secondary background hover',
        },
        {
          name: 'Secondary Background Pressed Bold',
          cssVar: '--color-secondary-background-pressed-bold',
          description: 'Bold secondary background pressed',
        },
      ],
    },
    {
      title: 'Neutral Background Colors',
      colors: [
        { name: 'Neutral Background', cssVar: '--color-neutral-background', description: 'Neutral background color' },
        {
          name: 'Neutral Background Hover',
          cssVar: '--color-neutral-background-hover',
          description: 'Neutral background hover state',
        },
        {
          name: 'Neutral Background Pressed',
          cssVar: '--color-neutral-background-pressed',
          description: 'Neutral background pressed state',
        },
        {
          name: 'Neutral Background Subtle',
          cssVar: '--color-neutral-background-subtle',
          description: 'Subtle neutral background',
        },
        {
          name: 'Neutral Background Hover Subtle',
          cssVar: '--color-neutral-background-hover-subtle',
          description: 'Subtle neutral background hover',
        },
        {
          name: 'Neutral Background Pressed Subtle',
          cssVar: '--color-neutral-background-pressed-subtle',
          description: 'Subtle neutral background pressed',
        },
        {
          name: 'Neutral Background Bold',
          cssVar: '--color-neutral-background-bold',
          description: 'Bold neutral background',
        },
        {
          name: 'Neutral Background Hover Bold',
          cssVar: '--color-neutral-background-hover-bold',
          description: 'Bold neutral background hover',
        },
        {
          name: 'Neutral Background Pressed Bold',
          cssVar: '--color-neutral-background-pressed-bold',
          description: 'Bold neutral background pressed',
        },
      ],
    },
    {
      title: 'State Background Colors - Safe & Info',
      colors: [
        { name: 'Safe Background', cssVar: '--color-safe-background', description: 'Safe state background' },
        {
          name: 'Safe Background Hover',
          cssVar: '--color-safe-background-hover',
          description: 'Safe background hover state',
        },
        {
          name: 'Safe Background Pressed',
          cssVar: '--color-safe-background-pressed',
          description: 'Safe background pressed state',
        },
        {
          name: 'Safe Background Subtle',
          cssVar: '--color-safe-background-subtle',
          description: 'Subtle safe background',
        },
        {
          name: 'Safe Background Hover Subtle',
          cssVar: '--color-safe-background-hover-subtle',
          description: 'Subtle safe background hover',
        },
        {
          name: 'Safe Background Pressed Subtle',
          cssVar: '--color-safe-background-pressed-subtle',
          description: 'Subtle safe background pressed',
        },
        { name: 'Safe Background Bold', cssVar: '--color-safe-background-bold', description: 'Bold safe background' },
        {
          name: 'Safe Background Hover Bold',
          cssVar: '--color-safe-background-hover-bold',
          description: 'Bold safe background hover',
        },
        {
          name: 'Safe Background Pressed Bold',
          cssVar: '--color-safe-background-pressed-bold',
          description: 'Bold safe background pressed',
        },
        { name: 'Info Background', cssVar: '--color-info-background', description: 'Info state background' },
        {
          name: 'Info Background Hover',
          cssVar: '--color-info-background-hover',
          description: 'Info background hover state',
        },
        {
          name: 'Info Background Pressed',
          cssVar: '--color-info-background-pressed',
          description: 'Info background pressed state',
        },
        {
          name: 'Info Background Subtle',
          cssVar: '--color-info-background-subtle',
          description: 'Subtle info background',
        },
        {
          name: 'Info Background Hover Subtle',
          cssVar: '--color-info-background-hover-subtle',
          description: 'Subtle info background hover',
        },
        {
          name: 'Info Background Pressed Subtle',
          cssVar: '--color-info-background-pressed-subtle',
          description: 'Subtle info background pressed',
        },
        { name: 'Info Background Bold', cssVar: '--color-info-background-bold', description: 'Bold info background' },
        {
          name: 'Info Background Hover Bold',
          cssVar: '--color-info-background-hover-bold',
          description: 'Bold info background hover',
        },
        {
          name: 'Info Background Pressed Bold',
          cssVar: '--color-info-background-pressed-bold',
          description: 'Bold info background pressed',
        },
      ],
    },
    {
      title: 'State Background Colors - Caution & Warning',
      colors: [
        { name: 'Caution Background', cssVar: '--color-caution-background', description: 'Caution state background' },
        {
          name: 'Caution Background Hover',
          cssVar: '--color-caution-background-hover',
          description: 'Caution background hover state',
        },
        {
          name: 'Caution Background Pressed',
          cssVar: '--color-caution-background-pressed',
          description: 'Caution background pressed state',
        },
        {
          name: 'Caution Background Subtle',
          cssVar: '--color-caution-background-subtle',
          description: 'Subtle caution background',
        },
        {
          name: 'Caution Background Hover Subtle',
          cssVar: '--color-caution-background-hover-subtle',
          description: 'Subtle caution background hover',
        },
        {
          name: 'Caution Background Pressed Subtle',
          cssVar: '--color-caution-background-pressed-subtle',
          description: 'Subtle caution background pressed',
        },
        {
          name: 'Caution Background Bold',
          cssVar: '--color-caution-background-bold',
          description: 'Bold caution background',
        },
        {
          name: 'Caution Background Hover Bold',
          cssVar: '--color-caution-background-hover-bold',
          description: 'Bold caution background hover',
        },
        {
          name: 'Caution Background Pressed Bold',
          cssVar: '--color-caution-background-pressed-bold',
          description: 'Bold caution background pressed',
        },
        { name: 'Warning Background', cssVar: '--color-warning-background', description: 'Warning state background' },
        {
          name: 'Warning Background Hover',
          cssVar: '--color-warning-background-hover',
          description: 'Warning background hover state',
        },
        {
          name: 'Warning Background Pressed',
          cssVar: '--color-warning-background-pressed',
          description: 'Warning background pressed state',
        },
        {
          name: 'Warning Background Subtle',
          cssVar: '--color-warning-background-subtle',
          description: 'Subtle warning background',
        },
        {
          name: 'Warning Background Hover Subtle',
          cssVar: '--color-warning-background-hover-subtle',
          description: 'Subtle warning background hover',
        },
        {
          name: 'Warning Background Pressed Subtle',
          cssVar: '--color-warning-background-pressed-subtle',
          description: 'Subtle warning background pressed',
        },
        {
          name: 'Warning Background Bold',
          cssVar: '--color-warning-background-bold',
          description: 'Bold warning background',
        },
        {
          name: 'Warning Background Hover Bold',
          cssVar: '--color-warning-background-hover-bold',
          description: 'Bold warning background hover',
        },
        {
          name: 'Warning Background Pressed Bold',
          cssVar: '--color-warning-background-pressed-bold',
          description: 'Bold warning background pressed',
        },
      ],
    },
    {
      title: 'State Background Colors - Danger',
      colors: [
        { name: 'Danger Background', cssVar: '--color-danger-background', description: 'Danger state background' },
        {
          name: 'Danger Background Hover',
          cssVar: '--color-danger-background-hover',
          description: 'Danger background hover state',
        },
        {
          name: 'Danger Background Pressed',
          cssVar: '--color-danger-background-pressed',
          description: 'Danger background pressed state',
        },
        {
          name: 'Danger Background Subtle',
          cssVar: '--color-danger-background-subtle',
          description: 'Subtle danger background',
        },
        {
          name: 'Danger Background Hover Subtle',
          cssVar: '--color-danger-background-hover-subtle',
          description: 'Subtle danger background hover',
        },
        {
          name: 'Danger Background Pressed Subtle',
          cssVar: '--color-danger-background-pressed-subtle',
          description: 'Subtle danger background pressed',
        },
        {
          name: 'Danger Background Bold',
          cssVar: '--color-danger-background-bold',
          description: 'Bold danger background',
        },
        {
          name: 'Danger Background Hover Bold',
          cssVar: '--color-danger-background-hover-bold',
          description: 'Bold danger background hover',
        },
        {
          name: 'Danger Background Pressed Bold',
          cssVar: '--color-danger-background-pressed-bold',
          description: 'Bold danger background pressed',
        },
      ],
    },
    {
      title: 'Extended Background Colors - Lime & Teal',
      colors: [
        { name: 'Lime Background', cssVar: '--color-lime-background', description: 'Lime background color' },
        {
          name: 'Lime Background Hover',
          cssVar: '--color-lime-background-hover',
          description: 'Lime background hover state',
        },
        {
          name: 'Lime Background Pressed',
          cssVar: '--color-lime-background-pressed',
          description: 'Lime background pressed state',
        },
        {
          name: 'Lime Background Subtle',
          cssVar: '--color-lime-background-subtle',
          description: 'Subtle lime background',
        },
        {
          name: 'Lime Background Hover Subtle',
          cssVar: '--color-lime-background-hover-subtle',
          description: 'Subtle lime background hover',
        },
        {
          name: 'Lime Background Pressed Subtle',
          cssVar: '--color-lime-background-pressed-subtle',
          description: 'Subtle lime background pressed',
        },
        { name: 'Lime Background Bold', cssVar: '--color-lime-background-bold', description: 'Bold lime background' },
        {
          name: 'Lime Background Hover Bold',
          cssVar: '--color-lime-background-hover-bold',
          description: 'Bold lime background hover',
        },
        {
          name: 'Lime Background Pressed Bold',
          cssVar: '--color-lime-background-pressed-bold',
          description: 'Bold lime background pressed',
        },
        { name: 'Teal Background', cssVar: '--color-teal-background', description: 'Teal background color' },
        {
          name: 'Teal Background Hover',
          cssVar: '--color-teal-background-hover',
          description: 'Teal background hover state',
        },
        {
          name: 'Teal Background Pressed',
          cssVar: '--color-teal-background-pressed',
          description: 'Teal background pressed state',
        },
        {
          name: 'Teal Background Subtle',
          cssVar: '--color-teal-background-subtle',
          description: 'Subtle teal background',
        },
        {
          name: 'Teal Background Hover Subtle',
          cssVar: '--color-teal-background-hover-subtle',
          description: 'Subtle teal background hover',
        },
        {
          name: 'Teal Background Pressed Subtle',
          cssVar: '--color-teal-background-pressed-subtle',
          description: 'Subtle teal background pressed',
        },
        { name: 'Teal Background Bold', cssVar: '--color-teal-background-bold', description: 'Bold teal background' },
        {
          name: 'Teal Background Hover Bold',
          cssVar: '--color-teal-background-hover-bold',
          description: 'Bold teal background hover',
        },
        {
          name: 'Teal Background Pressed Bold',
          cssVar: '--color-teal-background-pressed-bold',
          description: 'Bold teal background pressed',
        },
      ],
    },
    {
      title: 'Extended Background Colors - Indigo & Fuchsia',
      colors: [
        { name: 'Indigo Background', cssVar: '--color-indigo-background', description: 'Indigo background color' },
        {
          name: 'Indigo Background Hover',
          cssVar: '--color-indigo-background-hover',
          description: 'Indigo background hover state',
        },
        {
          name: 'Indigo Background Pressed',
          cssVar: '--color-indigo-background-pressed',
          description: 'Indigo background pressed state',
        },
        {
          name: 'Indigo Background Subtle',
          cssVar: '--color-indigo-background-subtle',
          description: 'Subtle indigo background',
        },
        {
          name: 'Indigo Background Hover Subtle',
          cssVar: '--color-indigo-background-hover-subtle',
          description: 'Subtle indigo background hover',
        },
        {
          name: 'Indigo Background Pressed Subtle',
          cssVar: '--color-indigo-background-pressed-subtle',
          description: 'Subtle indigo background pressed',
        },
        {
          name: 'Indigo Background Bold',
          cssVar: '--color-indigo-background-bold',
          description: 'Bold indigo background',
        },
        {
          name: 'Indigo Background Hover Bold',
          cssVar: '--color-indigo-background-hover-bold',
          description: 'Bold indigo background hover',
        },
        {
          name: 'Indigo Background Pressed Bold',
          cssVar: '--color-indigo-background-pressed-bold',
          description: 'Bold indigo background pressed',
        },
        { name: 'Fuchsia Background', cssVar: '--color-fuchsia-background', description: 'Fuchsia background color' },
        {
          name: 'Fuchsia Background Hover',
          cssVar: '--color-fuchsia-background-hover',
          description: 'Fuchsia background hover state',
        },
        {
          name: 'Fuchsia Background Pressed',
          cssVar: '--color-fuchsia-background-pressed',
          description: 'Fuchsia background pressed state',
        },
        {
          name: 'Fuchsia Background Subtle',
          cssVar: '--color-fuchsia-background-subtle',
          description: 'Subtle fuchsia background',
        },
        {
          name: 'Fuchsia Background Hover Subtle',
          cssVar: '--color-fuchsia-background-hover-subtle',
          description: 'Subtle fuchsia background hover',
        },
        {
          name: 'Fuchsia Background Pressed Subtle',
          cssVar: '--color-fuchsia-background-pressed-subtle',
          description: 'Subtle fuchsia background pressed',
        },
        {
          name: 'Fuchsia Background Bold',
          cssVar: '--color-fuchsia-background-bold',
          description: 'Bold fuchsia background',
        },
        {
          name: 'Fuchsia Background Hover Bold',
          cssVar: '--color-fuchsia-background-hover-bold',
          description: 'Bold fuchsia background hover',
        },
        {
          name: 'Fuchsia Background Pressed Bold',
          cssVar: '--color-fuchsia-background-pressed-bold',
          description: 'Bold fuchsia background pressed',
        },
      ],
    },
  ];
}
