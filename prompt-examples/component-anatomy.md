Using the `button-anatomy.html` file as a reference, you are tasked to create a page called `????-anatomy` that is an anatomy level guide of the ???? component.

The first thing will be the entire component at a high level showcasing everything together. This should point out the main elements of what is being described.

There also needs to be a visual guideline on how it is structured, which include things like:

- how element are displayed.
- spacing.
- which elements are optional or required.
- etc.

The after that there needs to be a section for each of the elements of the component.

Each of these sections would need to break down ther own element into there amotic units.

At this level we also need a visual guideline that is more fine grained and includes:

- how element are displayed.
- spacing.
- which elements are optional or required.
- font infomation
- color infomation
- border information
- etc.

Patterns to avoid and alternative things to use:

- **NEVER** use css class names in the outputted document, just use a description name to conveys the intent.

This end point would be a page that is high visual (only using text / lists where needed) guideline of the component that alone could be easily used to create a concrete implementation by someone of AI regardles of language, framework, tooling being used.

Whenever referencing values, **ALWAYS** reference the design token / css variable and the raw value in `()`.

**ALWAYS** verify before done:

- the svg line are rendered properly
- the rigth list og bp-tag are NOT overlapping and the parent blueprint is big enought to contain all the bp-tag
- make sure text in the ds-demo area is not being overlapped by the component example
