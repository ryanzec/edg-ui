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
        { name: 'Text Selected', cssVar: '--color-text-selected', description: 'Text in a selected state' },
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
        { name: 'Primary Text Bold', cssVar: '--color-primary-text-bold', description: 'Bold primary text' },
        { name: 'Secondary Text', cssVar: '--color-secondary-text', description: 'Secondary text color' },
        {
          name: 'Secondary Text Subtle',
          cssVar: '--color-secondary-text-subtle',
          description: 'Subtle secondary text',
        },
        { name: 'Secondary Text Bold', cssVar: '--color-secondary-text-bold', description: 'Bold secondary text' },
        { name: 'Neutral Text', cssVar: '--color-neutral-text', description: 'Neutral text color' },
        { name: 'Neutral Text Subtle', cssVar: '--color-neutral-text-subtle', description: 'Subtle neutral text' },
        { name: 'Neutral Text Bold', cssVar: '--color-neutral-text-bold', description: 'Bold neutral text' },
        { name: 'Safe Text', cssVar: '--color-safe-text', description: 'Success/safe state text' },
        { name: 'Safe Text Subtle', cssVar: '--color-safe-text-subtle', description: 'Subtle safe text' },
        { name: 'Safe Text Bold', cssVar: '--color-safe-text-bold', description: 'Bold safe text' },
        { name: 'Info Text', cssVar: '--color-info-text', description: 'Information state text' },
        { name: 'Info Text Subtle', cssVar: '--color-info-text-subtle', description: 'Subtle info text' },
        { name: 'Info Text Bold', cssVar: '--color-info-text-bold', description: 'Bold info text' },
        { name: 'Caution Text', cssVar: '--color-caution-text', description: 'Caution state text' },
        { name: 'Caution Text Subtle', cssVar: '--color-caution-text-subtle', description: 'Subtle caution text' },
        { name: 'Caution Text Bold', cssVar: '--color-caution-text-bold', description: 'Bold caution text' },
        { name: 'Warning Text', cssVar: '--color-warning-text', description: 'Warning state text' },
        { name: 'Warning Text Subtle', cssVar: '--color-warning-text-subtle', description: 'Subtle warning text' },
        { name: 'Warning Text Bold', cssVar: '--color-warning-text-bold', description: 'Bold warning text' },
        { name: 'Danger Text', cssVar: '--color-danger-text', description: 'Error/danger state text' },
        { name: 'Danger Text Subtle', cssVar: '--color-danger-text-subtle', description: 'Subtle danger text' },
        { name: 'Danger Text Bold', cssVar: '--color-danger-text-bold', description: 'Bold danger text' },
      ],
    },
    {
      title: 'Accent Text Colors',
      colors: [
        { name: 'Accent Lime Text', cssVar: '--color-accent-lime-text', description: 'Lime accent text' },
        {
          name: 'Accent Lime Text Subtle',
          cssVar: '--color-accent-lime-text-subtle',
          description: 'Subtle lime accent text',
        },
        {
          name: 'Accent Lime Text Bold',
          cssVar: '--color-accent-lime-text-bold',
          description: 'Bold lime accent text',
        },
        { name: 'Accent Teal Text', cssVar: '--color-accent-teal-text', description: 'Teal accent text' },
        {
          name: 'Accent Teal Text Subtle',
          cssVar: '--color-accent-teal-text-subtle',
          description: 'Subtle teal accent text',
        },
        {
          name: 'Accent Teal Text Bold',
          cssVar: '--color-accent-teal-text-bold',
          description: 'Bold teal accent text',
        },
        { name: 'Accent Indigo Text', cssVar: '--color-accent-indigo-text', description: 'Indigo accent text' },
        {
          name: 'Accent Indigo Text Subtle',
          cssVar: '--color-accent-indigo-text-subtle',
          description: 'Subtle indigo accent text',
        },
        {
          name: 'Accent Indigo Text Bold',
          cssVar: '--color-accent-indigo-text-bold',
          description: 'Bold indigo accent text',
        },
        { name: 'Accent Fuchsia Text', cssVar: '--color-accent-fuchsia-text', description: 'Fuchsia accent text' },
        {
          name: 'Accent Fuchsia Text Subtle',
          cssVar: '--color-accent-fuchsia-text-subtle',
          description: 'Subtle fuchsia accent text',
        },
        {
          name: 'Accent Fuchsia Text Bold',
          cssVar: '--color-accent-fuchsia-text-bold',
          description: 'Bold fuchsia accent text',
        },
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
    {
      title: 'Icon Colors',
      colors: [
        { name: 'Icon', cssVar: '--color-icon', description: 'Default icon color' },
        { name: 'Icon Subtle', cssVar: '--color-icon-subtle', description: 'Subtle icon color' },
        { name: 'Icon Disabled', cssVar: '--color-icon-disabled', description: 'Disabled icon with reduced opacity' },
        {
          name: 'Icon Inverse',
          cssVar: '--color-icon-inverse',
          description: 'Inverse icon color for dark backgrounds',
          backgroundColorVar: '--color-background-inverse',
        },
        { name: 'Icon Primary', cssVar: '--color-icon-primary', description: 'Primary intent icon' },
        { name: 'Icon Secondary', cssVar: '--color-icon-secondary', description: 'Secondary intent icon' },
        { name: 'Icon Neutral', cssVar: '--color-icon-neutral', description: 'Neutral intent icon' },
        { name: 'Icon Safe', cssVar: '--color-icon-safe', description: 'Safe state icon' },
        { name: 'Icon Info', cssVar: '--color-icon-info', description: 'Info state icon' },
        { name: 'Icon Caution', cssVar: '--color-icon-caution', description: 'Caution state icon' },
        { name: 'Icon Warning', cssVar: '--color-icon-warning', description: 'Warning state icon' },
        { name: 'Icon Danger', cssVar: '--color-icon-danger', description: 'Danger state icon' },
      ],
    },
  ];

  protected readonly borderColors: ColorCategory[] = [
    {
      title: 'Basic Border Colors',
      colors: [
        { name: 'Border', cssVar: '--color-border', description: 'Default border color' },
        { name: 'Border Subtle', cssVar: '--color-border-subtle', description: 'Subtle border color' },
        { name: 'Border Bold', cssVar: '--color-border-bold', description: 'Bold border color' },
        { name: 'Border Disabled', cssVar: '--color-border-disabled', description: 'Disabled border color' },
        { name: 'Border Selected', cssVar: '--color-border-selected', description: 'Selected state border' },
        { name: 'Input Border', cssVar: '--color-input-border', description: 'Default input border' },
        {
          name: 'Input Border Focused',
          cssVar: '--color-input-border-focused',
          description: 'Focused input border (alias of focus ring)',
        },
        { name: 'Focus Ring', cssVar: '--color-focus-ring', description: 'Focus indicator color' },
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
      title: 'Accent Border Colors',
      colors: [
        { name: 'Accent Lime Border', cssVar: '--color-accent-lime-border', description: 'Lime accent border' },
        {
          name: 'Accent Lime Border Subtle',
          cssVar: '--color-accent-lime-border-subtle',
          description: 'Subtle lime accent border',
        },
        {
          name: 'Accent Lime Border Bold',
          cssVar: '--color-accent-lime-border-bold',
          description: 'Bold lime accent border',
        },
        { name: 'Accent Teal Border', cssVar: '--color-accent-teal-border', description: 'Teal accent border' },
        {
          name: 'Accent Teal Border Subtle',
          cssVar: '--color-accent-teal-border-subtle',
          description: 'Subtle teal accent border',
        },
        {
          name: 'Accent Teal Border Bold',
          cssVar: '--color-accent-teal-border-bold',
          description: 'Bold teal accent border',
        },
        { name: 'Accent Indigo Border', cssVar: '--color-accent-indigo-border', description: 'Indigo accent border' },
        {
          name: 'Accent Indigo Border Subtle',
          cssVar: '--color-accent-indigo-border-subtle',
          description: 'Subtle indigo accent border',
        },
        {
          name: 'Accent Indigo Border Bold',
          cssVar: '--color-accent-indigo-border-bold',
          description: 'Bold indigo accent border',
        },
        {
          name: 'Accent Fuchsia Border',
          cssVar: '--color-accent-fuchsia-border',
          description: 'Fuchsia accent border',
        },
        {
          name: 'Accent Fuchsia Border Subtle',
          cssVar: '--color-accent-fuchsia-border-subtle',
          description: 'Subtle fuchsia accent border',
        },
        {
          name: 'Accent Fuchsia Border Bold',
          cssVar: '--color-accent-fuchsia-border-bold',
          description: 'Bold fuchsia accent border',
        },
      ],
    },
  ];

  protected readonly backgroundColors: ColorCategory[] = [
    {
      title: 'Surface Colors',
      colors: [
        { name: 'Surface', cssVar: '--color-surface', description: 'Base page surface' },
        {
          name: 'Surface Raised',
          cssVar: '--color-surface-raised',
          description: 'Slightly elevated surface (cards, panels)',
        },
        {
          name: 'Surface Overlay',
          cssVar: '--color-surface-overlay',
          description: 'High-elevation surface (popovers, menus)',
        },
        {
          name: 'Surface Sunken',
          cssVar: '--color-surface-sunken',
          description: 'Inset surface (wells, tracks)',
        },
      ],
    },
    {
      title: 'Base Background Colors',
      colors: [
        {
          name: 'Background',
          cssVar: '--color-background',
          description: 'Primary background color (alias of surface)',
        },
        { name: 'Background Inverse', cssVar: '--color-background-inverse', description: 'Inverse background color' },
        {
          name: 'Background Disabled',
          cssVar: '--color-background-disabled',
          description: 'Disabled background with reduced opacity',
        },
        {
          name: 'Background Selected',
          cssVar: '--color-background-selected',
          description: 'Background for selected items',
        },
        {
          name: 'Background Selected Hover',
          cssVar: '--color-background-selected-hover',
          description: 'Hover state for selected items',
        },
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
        {
          name: 'Input Background',
          cssVar: '--color-input-background',
          description: 'Default input background',
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
          name: 'Primary Background Subtle Hover',
          cssVar: '--color-primary-background-subtle-hover',
          description: 'Subtle primary background hover',
        },
        {
          name: 'Primary Background Subtle Pressed',
          cssVar: '--color-primary-background-subtle-pressed',
          description: 'Subtle primary background pressed',
        },
        {
          name: 'Primary Background Bold',
          cssVar: '--color-primary-background-bold',
          description: 'Bold primary background',
        },
        {
          name: 'Primary Background Bold Hover',
          cssVar: '--color-primary-background-bold-hover',
          description: 'Bold primary background hover',
        },
        {
          name: 'Primary Background Bold Pressed',
          cssVar: '--color-primary-background-bold-pressed',
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
          name: 'Secondary Background Subtle Hover',
          cssVar: '--color-secondary-background-subtle-hover',
          description: 'Subtle secondary background hover',
        },
        {
          name: 'Secondary Background Subtle Pressed',
          cssVar: '--color-secondary-background-subtle-pressed',
          description: 'Subtle secondary background pressed',
        },
        {
          name: 'Secondary Background Bold',
          cssVar: '--color-secondary-background-bold',
          description: 'Bold secondary background',
        },
        {
          name: 'Secondary Background Bold Hover',
          cssVar: '--color-secondary-background-bold-hover',
          description: 'Bold secondary background hover',
        },
        {
          name: 'Secondary Background Bold Pressed',
          cssVar: '--color-secondary-background-bold-pressed',
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
          name: 'Neutral Background Subtle Hover',
          cssVar: '--color-neutral-background-subtle-hover',
          description: 'Subtle neutral background hover',
        },
        {
          name: 'Neutral Background Subtle Pressed',
          cssVar: '--color-neutral-background-subtle-pressed',
          description: 'Subtle neutral background pressed',
        },
        {
          name: 'Neutral Background Bold',
          cssVar: '--color-neutral-background-bold',
          description: 'Bold neutral background',
        },
        {
          name: 'Neutral Background Bold Hover',
          cssVar: '--color-neutral-background-bold-hover',
          description: 'Bold neutral background hover',
        },
        {
          name: 'Neutral Background Bold Pressed',
          cssVar: '--color-neutral-background-bold-pressed',
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
          name: 'Safe Background Subtle Hover',
          cssVar: '--color-safe-background-subtle-hover',
          description: 'Subtle safe background hover',
        },
        {
          name: 'Safe Background Subtle Pressed',
          cssVar: '--color-safe-background-subtle-pressed',
          description: 'Subtle safe background pressed',
        },
        { name: 'Safe Background Bold', cssVar: '--color-safe-background-bold', description: 'Bold safe background' },
        {
          name: 'Safe Background Bold Hover',
          cssVar: '--color-safe-background-bold-hover',
          description: 'Bold safe background hover',
        },
        {
          name: 'Safe Background Bold Pressed',
          cssVar: '--color-safe-background-bold-pressed',
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
          name: 'Info Background Subtle Hover',
          cssVar: '--color-info-background-subtle-hover',
          description: 'Subtle info background hover',
        },
        {
          name: 'Info Background Subtle Pressed',
          cssVar: '--color-info-background-subtle-pressed',
          description: 'Subtle info background pressed',
        },
        { name: 'Info Background Bold', cssVar: '--color-info-background-bold', description: 'Bold info background' },
        {
          name: 'Info Background Bold Hover',
          cssVar: '--color-info-background-bold-hover',
          description: 'Bold info background hover',
        },
        {
          name: 'Info Background Bold Pressed',
          cssVar: '--color-info-background-bold-pressed',
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
          name: 'Caution Background Subtle Hover',
          cssVar: '--color-caution-background-subtle-hover',
          description: 'Subtle caution background hover',
        },
        {
          name: 'Caution Background Subtle Pressed',
          cssVar: '--color-caution-background-subtle-pressed',
          description: 'Subtle caution background pressed',
        },
        {
          name: 'Caution Background Bold',
          cssVar: '--color-caution-background-bold',
          description: 'Bold caution background',
        },
        {
          name: 'Caution Background Bold Hover',
          cssVar: '--color-caution-background-bold-hover',
          description: 'Bold caution background hover',
        },
        {
          name: 'Caution Background Bold Pressed',
          cssVar: '--color-caution-background-bold-pressed',
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
          name: 'Warning Background Subtle Hover',
          cssVar: '--color-warning-background-subtle-hover',
          description: 'Subtle warning background hover',
        },
        {
          name: 'Warning Background Subtle Pressed',
          cssVar: '--color-warning-background-subtle-pressed',
          description: 'Subtle warning background pressed',
        },
        {
          name: 'Warning Background Bold',
          cssVar: '--color-warning-background-bold',
          description: 'Bold warning background',
        },
        {
          name: 'Warning Background Bold Hover',
          cssVar: '--color-warning-background-bold-hover',
          description: 'Bold warning background hover',
        },
        {
          name: 'Warning Background Bold Pressed',
          cssVar: '--color-warning-background-bold-pressed',
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
          name: 'Danger Background Subtle Hover',
          cssVar: '--color-danger-background-subtle-hover',
          description: 'Subtle danger background hover',
        },
        {
          name: 'Danger Background Subtle Pressed',
          cssVar: '--color-danger-background-subtle-pressed',
          description: 'Subtle danger background pressed',
        },
        {
          name: 'Danger Background Bold',
          cssVar: '--color-danger-background-bold',
          description: 'Bold danger background',
        },
        {
          name: 'Danger Background Bold Hover',
          cssVar: '--color-danger-background-bold-hover',
          description: 'Bold danger background hover',
        },
        {
          name: 'Danger Background Bold Pressed',
          cssVar: '--color-danger-background-bold-pressed',
          description: 'Bold danger background pressed',
        },
      ],
    },
    {
      title: 'Accent Background Colors - Lime & Teal',
      colors: [
        {
          name: 'Accent Lime Background',
          cssVar: '--color-accent-lime-background',
          description: 'Lime accent background',
        },
        {
          name: 'Accent Lime Background Hover',
          cssVar: '--color-accent-lime-background-hover',
          description: 'Lime accent hover',
        },
        {
          name: 'Accent Lime Background Pressed',
          cssVar: '--color-accent-lime-background-pressed',
          description: 'Lime accent pressed',
        },
        {
          name: 'Accent Lime Background Subtle',
          cssVar: '--color-accent-lime-background-subtle',
          description: 'Subtle lime accent',
        },
        {
          name: 'Accent Lime Background Subtle Hover',
          cssVar: '--color-accent-lime-background-subtle-hover',
          description: 'Subtle lime accent hover',
        },
        {
          name: 'Accent Lime Background Subtle Pressed',
          cssVar: '--color-accent-lime-background-subtle-pressed',
          description: 'Subtle lime accent pressed',
        },
        {
          name: 'Accent Lime Background Bold',
          cssVar: '--color-accent-lime-background-bold',
          description: 'Bold lime accent',
        },
        {
          name: 'Accent Lime Background Bold Hover',
          cssVar: '--color-accent-lime-background-bold-hover',
          description: 'Bold lime accent hover',
        },
        {
          name: 'Accent Lime Background Bold Pressed',
          cssVar: '--color-accent-lime-background-bold-pressed',
          description: 'Bold lime accent pressed',
        },
        {
          name: 'Accent Teal Background',
          cssVar: '--color-accent-teal-background',
          description: 'Teal accent background',
        },
        {
          name: 'Accent Teal Background Hover',
          cssVar: '--color-accent-teal-background-hover',
          description: 'Teal accent hover',
        },
        {
          name: 'Accent Teal Background Pressed',
          cssVar: '--color-accent-teal-background-pressed',
          description: 'Teal accent pressed',
        },
        {
          name: 'Accent Teal Background Subtle',
          cssVar: '--color-accent-teal-background-subtle',
          description: 'Subtle teal accent',
        },
        {
          name: 'Accent Teal Background Subtle Hover',
          cssVar: '--color-accent-teal-background-subtle-hover',
          description: 'Subtle teal accent hover',
        },
        {
          name: 'Accent Teal Background Subtle Pressed',
          cssVar: '--color-accent-teal-background-subtle-pressed',
          description: 'Subtle teal accent pressed',
        },
        {
          name: 'Accent Teal Background Bold',
          cssVar: '--color-accent-teal-background-bold',
          description: 'Bold teal accent',
        },
        {
          name: 'Accent Teal Background Bold Hover',
          cssVar: '--color-accent-teal-background-bold-hover',
          description: 'Bold teal accent hover',
        },
        {
          name: 'Accent Teal Background Bold Pressed',
          cssVar: '--color-accent-teal-background-bold-pressed',
          description: 'Bold teal accent pressed',
        },
      ],
    },
    {
      title: 'Accent Background Colors - Indigo & Fuchsia',
      colors: [
        {
          name: 'Accent Indigo Background',
          cssVar: '--color-accent-indigo-background',
          description: 'Indigo accent background',
        },
        {
          name: 'Accent Indigo Background Hover',
          cssVar: '--color-accent-indigo-background-hover',
          description: 'Indigo accent hover',
        },
        {
          name: 'Accent Indigo Background Pressed',
          cssVar: '--color-accent-indigo-background-pressed',
          description: 'Indigo accent pressed',
        },
        {
          name: 'Accent Indigo Background Subtle',
          cssVar: '--color-accent-indigo-background-subtle',
          description: 'Subtle indigo accent',
        },
        {
          name: 'Accent Indigo Background Subtle Hover',
          cssVar: '--color-accent-indigo-background-subtle-hover',
          description: 'Subtle indigo accent hover',
        },
        {
          name: 'Accent Indigo Background Subtle Pressed',
          cssVar: '--color-accent-indigo-background-subtle-pressed',
          description: 'Subtle indigo accent pressed',
        },
        {
          name: 'Accent Indigo Background Bold',
          cssVar: '--color-accent-indigo-background-bold',
          description: 'Bold indigo accent',
        },
        {
          name: 'Accent Indigo Background Bold Hover',
          cssVar: '--color-accent-indigo-background-bold-hover',
          description: 'Bold indigo accent hover',
        },
        {
          name: 'Accent Indigo Background Bold Pressed',
          cssVar: '--color-accent-indigo-background-bold-pressed',
          description: 'Bold indigo accent pressed',
        },
        {
          name: 'Accent Fuchsia Background',
          cssVar: '--color-accent-fuchsia-background',
          description: 'Fuchsia accent background',
        },
        {
          name: 'Accent Fuchsia Background Hover',
          cssVar: '--color-accent-fuchsia-background-hover',
          description: 'Fuchsia accent hover',
        },
        {
          name: 'Accent Fuchsia Background Pressed',
          cssVar: '--color-accent-fuchsia-background-pressed',
          description: 'Fuchsia accent pressed',
        },
        {
          name: 'Accent Fuchsia Background Subtle',
          cssVar: '--color-accent-fuchsia-background-subtle',
          description: 'Subtle fuchsia accent',
        },
        {
          name: 'Accent Fuchsia Background Subtle Hover',
          cssVar: '--color-accent-fuchsia-background-subtle-hover',
          description: 'Subtle fuchsia accent hover',
        },
        {
          name: 'Accent Fuchsia Background Subtle Pressed',
          cssVar: '--color-accent-fuchsia-background-subtle-pressed',
          description: 'Subtle fuchsia accent pressed',
        },
        {
          name: 'Accent Fuchsia Background Bold',
          cssVar: '--color-accent-fuchsia-background-bold',
          description: 'Bold fuchsia accent',
        },
        {
          name: 'Accent Fuchsia Background Bold Hover',
          cssVar: '--color-accent-fuchsia-background-bold-hover',
          description: 'Bold fuchsia accent hover',
        },
        {
          name: 'Accent Fuchsia Background Bold Pressed',
          cssVar: '--color-accent-fuchsia-background-bold-pressed',
          description: 'Bold fuchsia accent pressed',
        },
      ],
    },
  ];
}
