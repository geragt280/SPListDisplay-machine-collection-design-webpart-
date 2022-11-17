export interface ListItemModel {
  Title?: string;
  Link?: {
    Description?: string;
    Url: string;
  };
  Application?: string;
  Image?: {
    type?: string;
    fileName: string;
    fieldName: string;
    serverUrl: string;
    fieldId: string;
    serverRelativeUrl: string;
  };
  Date?: Date;
}