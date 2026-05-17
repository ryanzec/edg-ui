/designer You are tasked to created a new component in [@kanban-board](file:///Users/ryanzec/repositories/angular-sandbox/projects/shared-ui/src/lib/core/kanban-board/)

This component is to replicate a swin lanes kanban board. for this implementation, we want to have:

- the ability to have multiple swinlanes (any number)
- when dragging one item, a preview of the item must follow the mouse and location of the item that is being dragged needs to be faded out
- must support being able to drag multiple items at the same time
- each swinline is independantly scrollable
- each swinlane will have a header and an element showing the number of items in each swinlane
- any item in any lane can be move to any other lane
- the lanes container must have horizontal scrolling if there are enough lined to need it
