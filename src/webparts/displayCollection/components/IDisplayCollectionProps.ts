import { IPropertyPaneDropdownOption } from "@microsoft/sp-property-pane";
import { SPFI } from "@pnp/sp";

export interface IDisplayCollectionProps {
  listId: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  pnpsp: SPFI;
  wptitle: string;
  pagingItems: number;
  field1: string;
  field2: string;
  field3: string;
}
