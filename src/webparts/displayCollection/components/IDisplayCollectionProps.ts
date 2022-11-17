import { SPFI } from "@pnp/sp";

export interface IDisplayCollectionProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  pnpsp: SPFI;
}
