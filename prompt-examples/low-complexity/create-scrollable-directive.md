You are tasked with creating a scrollable directive that apply customly styles scrollbar using modern native css techniques that gives a clean modern minimalist sleek look.

# Features

## Support vertical and horizontal scrolling

This directive MUST be able to support both horizontal and vertical scroll independently or at the same time.

## Support only show on hover of element

This directive MUST be able to both always showing the scrollbar when the element is scrollable and only showing the scrollbar when the mouse is over the element.

# Requirements

This component MUST have the following features implemented:

- The styling of the scrollbar MUST use modern native css techniques that gives a clean modern minimalist sleek look
- the selector MUST be `orgScrollArea`
- It MUST have the following inputs:
  - `scrollAreaDirection`: contorl which scroll direction are enable, possible values are:
    - `vertical` (default): ONLY y axis scroll enabled
    - `horizontal`: ONLY x axis scroll enabled
    - `both`: BOTH x and y axis scrolls enabled
  - `scrollAreaOnlyShowOnHover`: Controls when to should the scrollbar, possible values are:
    - `true`: Only show the scrollbars when the mouse is hovered over the elememt and is scrollable
    - `false` (Default): Only show the scrollbars when the elememt is scrollable
