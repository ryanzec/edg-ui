import { type DateTime } from 'luxon';
import { type ComponentColor } from '../../core/types/component-types';
import { type IconName } from '../../brain/icon-brain/icon-brain';

/** all available ticket status values, in workflow order */
export const allTicketStatuses = ['backlog', 'to-do', 'in-progress', 'blocked', 'in-review', 'done'] as const;

/** the workflow status of a ticket */
export type TicketStatus = (typeof allTicketStatuses)[number];

/** all available ticket priority values, from highest to lowest urgency */
export const allTicketPriorities = ['p1', 'p2', 'p3', 'p4'] as const;

/** the priority level of a ticket */
export type TicketPriority = (typeof allTicketPriorities)[number];

/** all available ticket type values */
export const allTicketTypes = ['bug', 'feature', 'task', 'incident'] as const;

/** the high-level type/category of a ticket */
export type TicketType = (typeof allTicketTypes)[number];

/** semantic color mapping used by the status chip and dropdown items */
export const ticketStatusColorMap: Record<TicketStatus, ComponentColor> = {
  backlog: 'neutral',
  'to-do': 'info',
  'in-progress': 'caution',
  blocked: 'danger',
  'in-review': 'secondary',
  done: 'safe',
};

/** human-readable label for each ticket status */
export const ticketStatusLabelMap: Record<TicketStatus, string> = {
  backlog: 'Backlog',
  'to-do': 'To do',
  'in-progress': 'In progress',
  blocked: 'Blocked',
  'in-review': 'In review',
  done: 'Done',
};

/** short descriptor rendered next to the status name in the status drop-down items */
export const ticketStatusDescriptorMap: Record<TicketStatus, string> = {
  backlog: 'Triage queue',
  'to-do': 'Ready to start',
  'in-progress': 'Actively working',
  blocked: 'Waiting on someone',
  'in-review': 'PR open',
  done: 'Shipped',
};

/** semantic color mapping for the priority pill */
export const ticketPriorityColorMap: Record<TicketPriority, ComponentColor> = {
  p1: 'danger',
  p2: 'warning',
  p3: 'caution',
  p4: 'neutral',
};

/** human-readable label for each priority value */
export const ticketPriorityLabelMap: Record<TicketPriority, string> = {
  p1: 'High',
  p2: 'Medium',
  p3: 'Low',
  p4: 'Lowest',
};

/** display label for each ticket type */
export const ticketTypeLabelMap: Record<TicketType, string> = {
  bug: 'Bug',
  feature: 'Feature',
  task: 'Task',
  incident: 'Incident',
};

/** a person referenced by a ticket (assignee, collaborator, reporter, etc.) */
export type TicketUser = {
  /** unique id for the user */
  id: string;
  /** display name shown in labels and tooltips */
  name: string;
  /** two-letter monogram rendered inside the avatar shape */
  initials: string;
  /** optional avatar image url; when omitted, initials are used */
  avatarSrc?: string;
};

/** a tag/label attached to a ticket */
export type TicketLabel = {
  /** display text of the label */
  label: string;
  /** optional semantic color — defaults to neutral when omitted */
  color?: ComponentColor;
};

/** properties metadata rendered in the right side panel */
export type TicketProperties = {
  /** the person who reported / opened the ticket */
  reporter: TicketUser;
  /** estimate of work effort (free-form, e.g. "3d", "5pt") */
  estimate: string;
  /** related branch name */
  branch: string;
  /** environment scope (e.g. "Production · Web") */
  environment: string;
  /** labels attached to the ticket */
  labels: TicketLabel[];
};

/** a single subtask under the ticket */
export type TicketSubtask = {
  /** unique id for the subtask */
  id: string;
  /** short identifier (e.g. "BCN-413") */
  code: string;
  /** title of the subtask */
  title: string;
  /** whether the subtask has been completed */
  completed: boolean;
};

/** an acceptance criterion line for a ticket */
export type TicketAcceptanceCriterion = {
  /** unique id for the criterion */
  id: string;
  /** description of the criterion */
  label: string;
  /** whether the criterion has been satisfied */
  completed: boolean;
};

/** a numbered reproduction step */
export type TicketReproductionStep = {
  /** rendered html-safe content for the step (may contain inline <code> markup via consumer pre-formatting) */
  content: string;
};

/** all available connected-work kinds */
export const allTicketConnectedWorkKinds = ['parent', 'blocked-by', 'linked-pr'] as const;

/** the kind of a connected-work entry, grouping items into sections */
export type TicketConnectedWorkKind = (typeof allTicketConnectedWorkKinds)[number];

/** all available linked-pr states */
export const allTicketLinkedPullRequestStates = ['draft', 'open', 'merged', 'closed'] as const;

/** the lifecycle state of a linked pull request */
export type TicketLinkedPullRequestState = (typeof allTicketLinkedPullRequestStates)[number];

/** a parent ticket reference */
export type TicketConnectedParent = {
  /** discriminator for the connected-work union */
  kind: 'parent';
  /** unique id */
  id: string;
  /** short identifier (e.g. "BCN-300") */
  code: string;
  /** title of the parent ticket */
  title: string;
};

/** a blocked-by reference to another ticket */
export type TicketConnectedBlockedBy = {
  /** discriminator for the connected-work union */
  kind: 'blocked-by';
  /** unique id */
  id: string;
  /** short identifier of the blocking ticket */
  code: string;
  /** title of the blocking ticket */
  title: string;
  /** current status of the blocking ticket */
  status: TicketStatus;
  /** the assignee currently working on resolving the blocker */
  assignee: TicketUser;
};

/** a linked pull request reference */
export type TicketConnectedLinkedPullRequest = {
  /** discriminator for the connected-work union */
  kind: 'linked-pr';
  /** unique id */
  id: string;
  /** display code (e.g. "#2841") */
  code: string;
  /** title of the pull request */
  title: string;
  /** lifecycle state of the pull request */
  state: TicketLinkedPullRequestState;
  /** the author of the pull request */
  author: TicketUser;
};

/** discriminated-union of every supported connected-work entry */
export type TicketConnectedWorkItem =
  | TicketConnectedParent
  | TicketConnectedBlockedBy
  | TicketConnectedLinkedPullRequest;

/** semantic color mapping for linked-pr states */
export const ticketLinkedPullRequestStateColorMap: Record<TicketLinkedPullRequestState, ComponentColor> = {
  draft: 'neutral',
  open: 'info',
  merged: 'safe',
  closed: 'danger',
};

/** all available activity change types — these are non-comment timeline entries */
export const allTicketActivityChangeTypes = [
  'created',
  'assigned',
  'moved',
  'opened-pr',
  'merged-pr',
  'requested-review',
  'completed-subtask',
  'blocked-by',
] as const;

/** the kind of a timeline change entry */
export type TicketActivityChangeType = (typeof allTicketActivityChangeTypes)[number];

/** a free-form comment posted by a user */
export type TicketActivityComment = {
  /** discriminator for the activity union */
  type: 'comment';
  /** unique id for the entry */
  id: string;
  /** the comment author */
  user: TicketUser;
  /** the comment timestamp */
  timestamp: DateTime;
  /** the comment body (plain text, may contain inline markdown that the consumer pre-renders) */
  body: string;
};

/** a non-comment activity change entry */
export type TicketActivityChange = {
  /** discriminator for the activity union */
  type: 'change';
  /** unique id for the entry */
  id: string;
  /** the user that performed the change */
  user: TicketUser;
  /** the change timestamp */
  timestamp: DateTime;
  /** the change classification used to drive the marker icon and color */
  changeType: TicketActivityChangeType;
  /** the descriptive change body (verb + target) appended after the user's name */
  description: string;
};

/** discriminated-union of every supported activity entry */
export type TicketActivityEntry = TicketActivityComment | TicketActivityChange;

/** marker icon shown inside the timeline dot for each change type */
export const ticketActivityChangeIconMap: Record<TicketActivityChangeType, IconName> = {
  created: 'plus',
  assigned: 'circle',
  moved: 'arrow-right',
  'opened-pr': 'circle',
  'merged-pr': 'check',
  'requested-review': 'arrow-right',
  'completed-subtask': 'check',
  'blocked-by': 'circle-x',
};

/** marker color shown for the timeline dot for each change type */
export const ticketActivityChangeColorMap: Record<TicketActivityChangeType, ComponentColor> = {
  created: 'neutral',
  assigned: 'neutral',
  moved: 'info',
  'opened-pr': 'secondary',
  'merged-pr': 'safe',
  'requested-review': 'info',
  'completed-subtask': 'safe',
  'blocked-by': 'danger',
};

/** information about why a ticket is blocked (drives the blocked banner) */
export type TicketBlockedInfo = {
  /** short reason text shown under the BLOCKED header */
  reason: string;
};

/** the complete ticket record consumed by the ticket-details template */
export type Ticket = {
  /** short identifier (e.g. "BCN-412") */
  code: string;
  /** ticket type / category */
  type: TicketType;
  /** the date the ticket was opened */
  openedAt: DateTime;
  /** the title of the ticket */
  title: string;
  /** the current workflow status */
  status: TicketStatus;
  /** the user currently assigned to the ticket */
  assignee: TicketUser;
  /** priority level */
  priority: TicketPriority;
  /** the due date of the ticket */
  dueDate: DateTime;
  /** additional collaborators rendered as a stacked avatar group */
  collaborators: TicketUser[];
  /** when present, the blocked banner is rendered above the description */
  blocked?: TicketBlockedInfo;
  /** the long-form description paragraphs (rendered as plain paragraphs preserving line breaks) */
  description: string;
  /** ordered list of reproduction steps */
  stepsToReproduce: TicketReproductionStep[];
  /** acceptance criteria checklist */
  acceptanceCriteria: TicketAcceptanceCriterion[];
  /** properties side-panel data */
  properties: TicketProperties;
  /** the subtasks under this ticket */
  subtasks: TicketSubtask[];
  /** connected-work references */
  connectedWork: TicketConnectedWorkItem[];
  /** the count of connected-work entries that need attention; drives the red badge */
  connectedWorkAttentionCount: number;
  /** the activity feed entries, ordered oldest first */
  activity: TicketActivityEntry[];
};

/** all supported activity feed filter values */
export const allTicketActivityFilters = ['all', 'comments', 'changes'] as const;

/** the activity feed filter selection */
export type TicketActivityFilter = (typeof allTicketActivityFilters)[number];
