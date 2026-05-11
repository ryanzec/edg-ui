import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Dialog as CdkDialog } from '@angular/cdk/dialog';
import { DateTime } from 'luxon';
import type { ChartConfiguration } from 'chart.js';
import { logManager } from '@organization/shared-utils';
import { ApplicationNavigation, type NavigationItem } from '../../core/application-navigation/application-navigation';
import { Avatar } from '../../core/avatar/avatar';
import { AvatarStack } from '../../core/avatar/avatar-stack';
import { AvatarStackOverflow } from '../../core/avatar/avatar-stack-overflow';
import { Box } from '../../core/box/box';
import { Button } from '../../core/button/button';
import { ButtonGroup } from '../../core/button/button-group';
import { ButtonToggle, type ButtonToggleItem } from '../../core/button-toggle/button-toggle';
import { Calendar } from '../../core/calendar/calendar';
import { Card } from '../../core/card/card';
import { CardContent } from '../../core/card/card-content';
import { CardFooter } from '../../core/card/card-footer';
import { CardHeader } from '../../core/card/card-header';
import { Chart } from '../../core/chart/chart';
import { Chat } from '../../core/chat/chat';
import { ChatMessage } from '../../core/chat/chat-message';
import { Checkbox } from '../../core/checkbox/checkbox';
import { CheckboxGroup } from '../../core/checkbox/checkbox-group';
import { CheckboxToggle } from '../../core/checkbox-toggle/checkbox-toggle';
import { Checklist, type ChecklistItemData } from '../../core/checklist/checklist';
import { CodeBlock } from '../../core/code-block/code-block';
import { CodeHighlighter } from '../../core/code-highlighter/code-highlighter';
import { Combobox } from '../../core/combobox/combobox';
import { type ComboboxOptionInput } from '../../core/combobox-store/combobox-store';
import { DatePickerInput } from '../../core/date-picker-input/date-picker-input';
import { DatePipe } from '../../core/date-pipe/date-pipe';
import { Dialog } from '../../core/dialog/dialog';
import { DialogContent } from '../../core/dialog/dialog-content';
import { DialogFooter } from '../../core/dialog/dialog-footer';
import { DialogHeader } from '../../core/dialog/dialog-header';
import { Divider } from '../../core/divider/divider';
import { DropDownSelector } from '../../core/drop-down-selector/drop-down-selector';
import { type SelectionValue } from '../../brain/drop-down-selector-brain/drop-down-selector-brain';
import { EmptyIndicator } from '../../core/empty-indicator/empty-indicator';
import { FileUploadComponent } from '../../core/file-upload/file-upload';
import { FormField } from '../../core/form-fields/form-field';
import { FormFields } from '../../core/form-fields/form-fields';
import { Icon } from '../../core/icon/icon';
import { Indicator } from '../../core/indicator/indicator';
import { Input } from '../../core/input/input';
import { Label } from '../../core/label/label';
import { LastUpdated } from '../../core/last-updated/last-updated';
import { Link } from '../../core/link/link';
import { List } from '../../core/list/list';
import { ListItem } from '../../core/list/list-item';
import { ListItemIcon } from '../../core/list/list-item-icon';
import { LoadingBlocker } from '../../core/loading-blocker/loading-blocker';
import { LoadingSpinner } from '../../core/loading-spinner/loading-spinner';
import { Markdown } from '../../core/markdown/markdown';
import { NotificationManager } from '../../core/notification-manager/notification-manager';
import { Notifications } from '../../core/notifications/notifications';
import { OverlayMenu, type OverlayMenuItem } from '../../core/overlay-menu/overlay-menu';
import { Pagination } from '../../core/pagination/pagination';
import { Radio } from '../../core/radio/radio';
import { RadioGroup } from '../../core/radio/radio-group';
import { ScrollArea } from '../../core/scroll-area/scroll-area';
import { Skeleton } from '../../core/skeleton/skeleton';
import { SlideContainer } from '../../core/slide-container/slide-container';
import { SlideContainerItem } from '../../core/slide-container/slide-container-item';
import { Splitter } from '../../core/splitter/splitter';
import { Table } from '../../core/table/table';
import { TableCell } from '../../core/table/table-cell';
import { TableHeader } from '../../core/table/table-header';
import { Tab } from '../../core/tabs/tab';
import { Tabs } from '../../core/tabs/tabs';
import { Tag } from '../../core/tag/tag';
import { TextDirective } from '../../core/text-directive/text-directive';
import { Textarea } from '../../core/textarea/textarea';
import { TimeInput } from '../../core/time-input/time-input';
import { Timeline } from '../../core/timeline/timeline';
import { TimelineItem } from '../../core/timeline/timeline-item';
import { TimelineHeader } from '../../core/timeline/timeline-header';
import { TimelineContent } from '../../core/timeline/timeline-content';
import { TimelineTime } from '../../core/timeline/timeline-time';
import { Tooltip } from '../../core/tooltip/tooltip';
import { TooltipContent } from '../../core/tooltip/tooltip-content';
import { TypedContextDirective } from '../../core/typed-context-directive/typed-context-directive';
import { UnsavedChangesDialog } from '../../core/unsaved-changes-dialog/unsaved-changes-dialog';
import { type IconName } from '../../brain/icon-brain/icon-brain';

/** a row in the table demo */
type TableUser = {
  id: string;
  name: string;
  owner: string;
  updated: string;
  records: number;
};

@Component({
  selector: 'org-all-components',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    ApplicationNavigation,
    Avatar,
    AvatarStack,
    AvatarStackOverflow,
    Box,
    Button,
    ButtonGroup,
    ButtonToggle,
    Calendar,
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    Chart,
    Chat,
    ChatMessage,
    Checkbox,
    CheckboxGroup,
    CheckboxToggle,
    Checklist,
    CodeBlock,
    CodeHighlighter,
    Combobox,
    DatePickerInput,
    DatePipe,
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    Divider,
    DropDownSelector,
    EmptyIndicator,
    FileUploadComponent,
    FormField,
    FormFields,
    Icon,
    Indicator,
    Input,
    Label,
    LastUpdated,
    Link,
    List,
    ListItem,
    ListItemIcon,
    LoadingBlocker,
    LoadingSpinner,
    Markdown,
    Notifications,
    OverlayMenu,
    Pagination,
    Radio,
    RadioGroup,
    ScrollArea,
    Skeleton,
    SlideContainer,
    SlideContainerItem,
    Splitter,
    Table,
    TableCell,
    TableHeader,
    Tab,
    Tabs,
    Tag,
    TextDirective,
    Textarea,
    TimeInput,
    Timeline,
    TimelineItem,
    TimelineHeader,
    TimelineContent,
    TimelineTime,
    Tooltip,
    TooltipContent,
    TypedContextDirective,
  ],
  templateUrl: './all-components.html',
  styleUrl: './all-components.css',
})
export class AllComponents {
  private readonly _notificationManager = inject(NotificationManager);
  private readonly _cdkDialog = inject(CdkDialog);

  /** all semantic component colors used across the showcase rows */
  protected readonly allColors = ['primary', 'secondary', 'neutral', 'safe', 'info', 'caution', 'warning', 'danger'] as const;

  /** a representative sample of icon names to render in the icon grid */
  protected readonly sampleIconNames: IconName[] = [
    'house',
    'search',
    'settings',
    'mail',
    'calendar',
    'users',
    'file-text',
    'folder',
    'package',
    'send',
    'pencil',
    'trash',
    'plus',
    'check',
    'x',
    'sparkles',
  ];

  /** items rendered by the button-toggle demo */
  protected readonly buttonToggleItems: ButtonToggleItem[] = [
    { label: 'Day', value: 'day', buttonColor: 'primary' },
    { label: 'Week', value: 'week', buttonColor: 'primary' },
    { label: 'Month', value: 'month', buttonColor: 'primary' },
  ];

  /** value bound to the button-toggle demo */
  protected readonly buttonToggleValue = signal<string>('week');

  /** items rendered by the combobox demo */
  protected readonly comboboxOptions: ComboboxOptionInput[] = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
    { value: 'date', label: 'Date' },
    { value: 'elderberry', label: 'Elderberry' },
  ];

  /** items rendered by the drop-down selector demo */
  protected readonly dropDownItems: SelectionValue<string>[] = [
    { value: 'last-updated', display: 'Last updated' },
    { value: 'name-asc', display: 'Name (A → Z)' },
    { value: 'created-date', display: 'Created date' },
    { value: 'owner', display: 'Owner' },
  ];

  /** the currently-selected drop-down items */
  protected readonly dropDownSelectedItems = signal<SelectionValue<string>[]>([this.dropDownItems[0]]);

  /** items rendered by the checklist demo */
  protected readonly checklistItems: ChecklistItemData[] = [
    { id: 'step-1', label: 'Profile details', status: 'valid' },
    { id: 'step-2', label: 'Billing address', status: 'in-progress' },
    { id: 'step-3', label: 'Payment method', status: 'invalid' },
    { id: 'step-4', label: 'Notifications', status: 'not-started' },
  ];

  /** tabs displayed in the tabs demo */
  protected readonly tabItems = [
    { value: 'overview', label: 'Overview' },
    { value: 'activity', label: 'Activity' },
    { value: 'settings', label: 'Settings' },
  ];

  /** currently active tab value */
  protected readonly activeTabValue = signal<string>('overview');

  /** current page bound to the pagination demo */
  protected readonly paginationCurrentPage = signal<number>(2);

  /** items per page bound to the pagination demo */
  protected readonly paginationItemsPerPage = signal<number>(10);

  /** a reference moment used by date / time relative-display components */
  protected readonly nowDateTime: DateTime = DateTime.now();

  /** a past moment used by the last-updated demo */
  protected readonly twoHoursAgo: DateTime = DateTime.now().minus({ hours: 2 });

  /** a sample markdown body for the markdown component demo */
  protected readonly markdownSample = [
    '## Heading',
    '',
    'Some **bold**, _italic_, and `inline code` text with a [link](#).',
    '',
    '- First bullet',
    '- Second bullet',
  ].join('\n');

  /** a sample code snippet used by the code-block / code-highlighter demos */
  protected readonly codeSample = `function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

greet('world');`;

  /** unified reactive form covering the form-bound demo controls */
  protected readonly form = new FormGroup({
    text: new FormControl('hello'),
    textarea: new FormControl('multi-line\ncontent'),
    radio: new FormControl('email'),
    checkboxToggle: new FormControl<string[]>(['notify']),
  });

  /** navigation items rendered in the application-navigation demo */
  protected readonly navigationItems: NavigationItem[] = [
    { id: 'home', label: 'Home', icon: 'house', routePath: '/home' },
    { id: 'search', label: 'Search', icon: 'search', routePath: '/search' },
    { id: 'team', label: 'Team', icon: 'users', routePath: '/team' },
    { id: 'inbox', label: 'Inbox', icon: 'mail', routePath: '/inbox' },
  ];

  /** items rendered in the application-navigation settings menu */
  protected readonly settingsMenuItems: OverlayMenuItem[] = [
    { id: 'settings', label: 'Settings', icon: 'settings' },
    { id: 'sign-out', label: 'Sign out', icon: 'log-out' },
  ];

  /** items rendered by the overlay-menu demo */
  protected readonly overlayMenuItems: OverlayMenuItem[] = [
    { id: 'edit', label: 'Edit', icon: 'pencil' },
    { id: 'duplicate', label: 'Duplicate', icon: 'copy' },
    { id: 'delete', label: 'Delete', icon: 'trash' },
  ];

  /** sample data backing the table demo */
  protected readonly tableUsers: TableUser[] = [
    { id: '1', name: 'Aurora — Mobile redesign', owner: 'P. Shah', updated: '2h ago', records: 1204 },
    { id: '2', name: 'Beacon — Billing v2', owner: 'D. Nakamura', updated: '5h ago', records: 342 },
    { id: '3', name: 'Cinder — Internal docs', owner: 'L. Wexler', updated: '1d ago', records: 87 },
  ];

  /** chart.js configuration used by the chart demo */
  protected readonly chartConfig: ChartConfiguration = {
    type: 'bar',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      datasets: [
        {
          label: 'Deploys',
          data: [12, 19, 8, 15, 22],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
    },
  };

  /** logs an interaction event from one of the demo components */
  protected onLog(type: string, value: unknown): void {
    logManager.log({ type, value });
  }

  /** handles tab value changes from the tabs demo */
  protected onTabChanged(value: string): void {
    this.activeTabValue.set(value);
  }

  /** handles button-toggle value changes from the button-toggle demo */
  protected onButtonToggleChanged(value: string): void {
    this.buttonToggleValue.set(value);
  }

  /** handles pagination current-page changes from the pagination demo */
  protected onPaginationPageChange(page: number): void {
    this.paginationCurrentPage.set(page);
  }

  /** handles pagination page-size changes from the pagination demo */
  protected onPaginationItemsPerPageChange(itemsPerPage: number): void {
    this.paginationItemsPerPage.set(itemsPerPage);
  }

  /** handles drop-down selector selection changes */
  protected onDropDownSelectedItemsChange(items: SelectionValue<string>[]): void {
    this.dropDownSelectedItems.set(items);
  }

  /** pushes a sample notification onto the notifications host for demo purposes */
  protected onPushNotification(): void {
    this._notificationManager.add({
      title: 'Saved successfully',
      message: 'Your changes have been written.',
      color: 'safe',
      canClose: true,
      autoCloseIn: 4000,
    });
  }

  /** opens the UnsavedChangesDialog via the CDK Dialog service — it cannot render inline because it injects DialogRef */
  protected onOpenUnsavedChangesDialog(): void {
    this._cdkDialog.open<boolean>(UnsavedChangesDialog);
  }
}
