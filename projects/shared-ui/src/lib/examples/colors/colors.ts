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
      title: 'Foreground Colors',
      colors: [
        { name: 'Foreground', cssVar: '--color-fg', description: 'Primary text color' },
        { name: 'Foreground Muted', cssVar: '--color-fg-muted', description: 'De-emphasized text' },
        { name: 'Foreground Faint', cssVar: '--color-fg-faint', description: 'Faint or disabled text' },
        {
          name: 'Foreground On Accent',
          cssVar: '--color-fg-on-accent',
          description: 'Text placed on top of accent backgrounds',
          backgroundColorVar: '--color-fg',
        },
      ],
    },
    {
      title: 'Semantic Colors',
      colors: [
        { name: 'Primary', cssVar: '--color-primary', description: 'Primary brand color' },
        { name: 'Secondary', cssVar: '--color-secondary', description: 'Secondary brand color' },
        { name: 'Neutral', cssVar: '--color-neutral', description: 'Neutral color' },
        { name: 'Safe', cssVar: '--color-safe', description: 'Success / safe state' },
        { name: 'Info', cssVar: '--color-info', description: 'Information state' },
        { name: 'Caution', cssVar: '--color-caution', description: 'Caution state' },
        { name: 'Warning', cssVar: '--color-warning', description: 'Warning state' },
        { name: 'Danger', cssVar: '--color-danger', description: 'Danger / error state' },
      ],
    },
    {
      title: 'Link & Focus',
      colors: [
        { name: 'Link', cssVar: '--color-link', description: 'Default link color' },
        { name: 'Link Hover', cssVar: '--color-link-hover', description: 'Link hover state' },
        { name: 'Link Active', cssVar: '--color-link-active', description: 'Link active state' },
        { name: 'Link Disabled', cssVar: '--color-link-disabled', description: 'Disabled link' },
        { name: 'Focus Ring', cssVar: '--color-focus-ring', description: 'Focus indicator color' },
      ],
    },
    {
      title: 'Color Palette',
      colors: [
        { name: 'Red', cssVar: '--color-red', description: 'Red palette color' },
        { name: 'Orange', cssVar: '--color-orange', description: 'Orange palette color' },
        { name: 'Yellow', cssVar: '--color-yellow', description: 'Yellow palette color' },
        { name: 'Green', cssVar: '--color-green', description: 'Green palette color' },
        { name: 'Teal', cssVar: '--color-teal', description: 'Teal palette color' },
        { name: 'Blue', cssVar: '--color-blue', description: 'Blue palette color' },
        { name: 'Purple', cssVar: '--color-purple', description: 'Purple palette color' },
        { name: 'Pink', cssVar: '--color-pink', description: 'Pink palette color' },
      ],
    },
  ];

  protected readonly borderColors: ColorCategory[] = [
    {
      title: 'Surface Borders',
      colors: [
        { name: 'Border', cssVar: '--color-border', description: 'Default border color' },
        { name: 'Border Soft', cssVar: '--color-border-soft', description: 'Soft border color' },
        { name: 'Border Strong', cssVar: '--color-border-strong', description: 'Strong border color' },
      ],
    },
    {
      title: 'Semantic Borders',
      colors: [
        { name: 'Primary Border', cssVar: '--color-primary-border', description: 'Primary border' },
        { name: 'Primary Border Soft', cssVar: '--color-primary-border-soft', description: 'Soft primary border' },
        {
          name: 'Primary Border Strong',
          cssVar: '--color-primary-border-strong',
          description: 'Strong primary border',
        },
        { name: 'Secondary Border', cssVar: '--color-secondary-border', description: 'Secondary border' },
        { name: 'Neutral Border', cssVar: '--color-neutral-border', description: 'Neutral border' },
        { name: 'Safe Border', cssVar: '--color-safe-border', description: 'Safe border' },
        { name: 'Info Border', cssVar: '--color-info-border', description: 'Info border' },
        { name: 'Caution Border', cssVar: '--color-caution-border', description: 'Caution border' },
        { name: 'Warning Border', cssVar: '--color-warning-border', description: 'Warning border' },
        { name: 'Danger Border', cssVar: '--color-danger-border', description: 'Danger border' },
      ],
    },
  ];

  protected readonly backgroundColors: ColorCategory[] = [
    {
      title: 'Surface Backgrounds',
      colors: [
        { name: 'Background App', cssVar: '--color-bg-app', description: 'App background' },
        { name: 'Background Sidebar', cssVar: '--color-bg-sidebar', description: 'Sidebar background' },
        { name: 'Background Surface', cssVar: '--color-bg-surface', description: 'Surface background' },
        {
          name: 'Background Surface 2',
          cssVar: '--color-bg-surface-secondary',
          description: 'Elevated surface background',
        },
        { name: 'Background Hover', cssVar: '--color-bg-hover', description: 'Hover state background' },
        { name: 'Background Active', cssVar: '--color-bg-active', description: 'Active state background' },
      ],
    },
    {
      title: 'Semantic Backgrounds',
      colors: [
        { name: 'Primary', cssVar: '--color-primary', description: 'Primary background' },
        { name: 'Primary Hover', cssVar: '--color-primary-hover', description: 'Primary hover' },
        { name: 'Primary Active', cssVar: '--color-primary-active', description: 'Primary active' },
        { name: 'Primary Soft', cssVar: '--color-primary-soft', description: 'Soft primary' },
        { name: 'Primary Soft Hover', cssVar: '--color-primary-soft-hover', description: 'Soft primary hover' },
        { name: 'Primary Soft Active', cssVar: '--color-primary-soft-active', description: 'Soft primary active' },
        { name: 'Secondary', cssVar: '--color-secondary', description: 'Secondary background' },
        { name: 'Secondary Soft', cssVar: '--color-secondary-soft', description: 'Soft secondary' },
        { name: 'Neutral', cssVar: '--color-neutral', description: 'Neutral background' },
        { name: 'Neutral Soft', cssVar: '--color-neutral-soft', description: 'Soft neutral' },
        { name: 'Safe', cssVar: '--color-safe', description: 'Safe background' },
        { name: 'Safe Soft', cssVar: '--color-safe-soft', description: 'Soft safe' },
        { name: 'Info', cssVar: '--color-info', description: 'Info background' },
        { name: 'Info Soft', cssVar: '--color-info-soft', description: 'Soft info' },
        { name: 'Caution', cssVar: '--color-caution', description: 'Caution background' },
        { name: 'Caution Soft', cssVar: '--color-caution-soft', description: 'Soft caution' },
        { name: 'Warning', cssVar: '--color-warning', description: 'Warning background' },
        { name: 'Warning Soft', cssVar: '--color-warning-soft', description: 'Soft warning' },
        { name: 'Danger', cssVar: '--color-danger', description: 'Danger background' },
        { name: 'Danger Soft', cssVar: '--color-danger-soft', description: 'Soft danger' },
      ],
    },
    {
      title: 'Palette Backgrounds',
      colors: [
        { name: 'Red', cssVar: '--color-red', description: 'Red palette background' },
        { name: 'Red Soft', cssVar: '--color-red-soft', description: 'Soft red background' },
        { name: 'Orange', cssVar: '--color-orange', description: 'Orange palette background' },
        { name: 'Orange Soft', cssVar: '--color-orange-soft', description: 'Soft orange background' },
        { name: 'Yellow', cssVar: '--color-yellow', description: 'Yellow palette background' },
        { name: 'Yellow Soft', cssVar: '--color-yellow-soft', description: 'Soft yellow background' },
        { name: 'Green', cssVar: '--color-green', description: 'Green palette background' },
        { name: 'Green Soft', cssVar: '--color-green-soft', description: 'Soft green background' },
        { name: 'Teal', cssVar: '--color-teal', description: 'Teal palette background' },
        { name: 'Teal Soft', cssVar: '--color-teal-soft', description: 'Soft teal background' },
        { name: 'Blue', cssVar: '--color-blue', description: 'Blue palette background' },
        { name: 'Blue Soft', cssVar: '--color-blue-soft', description: 'Soft blue background' },
        { name: 'Purple', cssVar: '--color-purple', description: 'Purple palette background' },
        { name: 'Purple Soft', cssVar: '--color-purple-soft', description: 'Soft purple background' },
        { name: 'Pink', cssVar: '--color-pink', description: 'Pink palette background' },
        { name: 'Pink Soft', cssVar: '--color-pink-soft', description: 'Soft pink background' },
      ],
    },
  ];
}
