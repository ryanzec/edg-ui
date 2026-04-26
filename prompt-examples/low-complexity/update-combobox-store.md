You are tasked with making the following changes to the combobox store.

# Opened state

The combobox store MUST store whether or not the combobox is in a opened state. It MUST expose methods to get this state and set this state along with a event that is triggered when this state changes

# Grouping state

The combobox store MUST keep track if grouping is enabled and this can be set when initializing or after the fact. The store MUST still provide both teh ability to get grouped and non-grouped versions of the output, this is just a indicator used by the component that uses this store.
